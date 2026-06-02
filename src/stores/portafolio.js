import { defineStore } from 'pinia'
import { clienteSupabase, supabaseConfigurado } from '../lib/supabase'

const CLAVE_LOCAL_VISITAS = 'visitas_locales_portafolio'
const urlWebhookPush = import.meta.env.VITE_PUSH_WEBHOOK_URL

const normalizarTexto = (texto = '', maximo = 180) =>
  texto.toString().trim().replace(/\s+/g, ' ').slice(0, maximo)

const enviarNotificacionPush = async (nombre, mensaje) => {
  if (!urlWebhookPush) {
    return
  }

  try {
    await fetch(urlWebhookPush, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: 'Nuevo mensaje en chat',
        cuerpo: `${nombre}: ${mensaje}`,
      }),
    })
  } catch (error) {
    console.error('Error al enviar push', error)
  }
}

export const usePortafolioStore = defineStore('portafolio', {
  state: () => ({
    modoOscuro: true,
    visitas: 0,
    mensajes: [],
    cargandoChat: false,
    errorChat: '',
  }),
  actions: {
    inicializarModo() {
      const guardado = localStorage.getItem('modo_oscuro')
      this.modoOscuro = guardado ? guardado === 'si' : true
    },

    alternarModo() {
      this.modoOscuro = !this.modoOscuro
      localStorage.setItem('modo_oscuro', this.modoOscuro ? 'si' : 'no')
    },

    async incrementarVisitas() {
      try {
        if (!supabaseConfigurado) {
          const actual = Number(localStorage.getItem(CLAVE_LOCAL_VISITAS) ?? 0) + 1
          localStorage.setItem(CLAVE_LOCAL_VISITAS, String(actual))
          this.visitas = actual
          return
        }

        const { data: fila, error: errorConsulta } = await clienteSupabase
          .from('metricas')
          .select('id,total')
          .eq('clave', 'visitas_globales')
          .maybeSingle()

        if (errorConsulta) {
          throw errorConsulta
        }

        if (!fila) {
          const { data: nuevaFila, error: errorInsercion } = await clienteSupabase
            .from('metricas')
            .insert([{ clave: 'visitas_globales', total: 1 }])
            .select('total')
            .single()

          if (errorInsercion) {
            throw errorInsercion
          }

          this.visitas = nuevaFila.total
          return
        }

        const nuevoTotal = Number(fila.total ?? 0) + 1
        const { data: actualizada, error: errorActualizacion } = await clienteSupabase
          .from('metricas')
          .update({ total: nuevoTotal })
          .eq('id', fila.id)
          .select('total')
          .single()

        if (errorActualizacion) {
          throw errorActualizacion
        }

        this.visitas = actualizada.total
      } catch (error) {
        console.error('Error al incrementar visitas', error)
      }
    },

    async cargarMensajes() {
      this.cargandoChat = true
      this.errorChat = ''

      try {
        if (!supabaseConfigurado) {
          this.mensajes = []
          return
        }

        const { data, error } = await clienteSupabase
          .from('chat_mensajes')
          .select('id,nombre,mensaje,creado_en')
          .order('creado_en', { ascending: false })
          .limit(20)

        if (error) {
          throw error
        }

        this.mensajes = data ?? []
      } catch (error) {
        this.errorChat = 'No pude cargar el chat todavía.'
        console.error('Error al cargar mensajes', error)
      } finally {
        this.cargandoChat = false
      }
    },

    async enviarMensaje(nombre, mensaje) {
      const nombreSeguro = normalizarTexto(nombre, 40)
      const mensajeSeguro = normalizarTexto(mensaje, 220)

      if (!nombreSeguro || !mensajeSeguro) {
        this.errorChat = 'Escribe tu nombre y un mensaje.'
        return false
      }

      this.errorChat = ''

      try {
        if (!supabaseConfigurado) {
          this.mensajes = [
            {
              id: Date.now(),
              nombre: nombreSeguro,
              mensaje: `${mensajeSeguro} (modo demo)`,
              creado_en: new Date().toISOString(),
            },
            ...this.mensajes,
          ]

          await enviarNotificacionPush(nombreSeguro, mensajeSeguro)
          return true
        }

        const { error } = await clienteSupabase.from('chat_mensajes').insert([
          {
            nombre: nombreSeguro,
            mensaje: mensajeSeguro,
          },
        ])

        if (error) {
          throw error
        }

        await enviarNotificacionPush(nombreSeguro, mensajeSeguro)
        return true
      } catch (error) {
        this.errorChat = 'No pude enviar el mensaje. Intenta de nuevo.'
        console.error('Error al enviar mensaje', error)
        return false
      }
    },

    suscribirseMensajes(alRecibir) {
      if (!supabaseConfigurado) {
        return () => {}
      }

      const canal = clienteSupabase
        .channel('chat-tiempo-real')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_mensajes',
          },
          (evento) => {
            this.mensajes = [evento.new, ...this.mensajes].slice(0, 20)
            if (typeof alRecibir === 'function') {
              alRecibir(evento.new)
            }
          }
        )
        .subscribe()

      return () => {
        clienteSupabase.removeChannel(canal)
      }
    },
  },
})
