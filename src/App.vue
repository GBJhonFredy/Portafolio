<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { animate, stagger } from 'animejs'
import { usePortafolioStore } from './stores/portafolio'
import { supabaseConfigurado } from './lib/supabase'

gsap.registerPlugin(ScrollTrigger)

const store = usePortafolioStore()
const { modoOscuro, visitas, mensajes, cargandoChat, errorChat } = storeToRefs(store)

const textoCompleto =
  'Hola, soy Fredy. Amo crear páginas bonitas, rápidas y con animaciones increíbles.'
const textoSobreMi = ref('')
const indiceTexto = ref(0)

const canvasHero = ref(null)
const nuevoNombre = ref('')
const nuevoMensaje = ref('')
const easterEggActivo = ref(false)

let intervaloTypewriter = null
let desuscribirChat = () => {}
let limpiarThree = () => {}
let limpiarCursor = () => {}
let limpiarSecreto = () => {}

const proyectos = [
  {
    titulo: 'Dashboard Interactivo',
    descripcion: 'Panel con gráficas animadas para tomar decisiones rápido.',
    tecnologia: 'Vue + Pinia + GSAP',
  },
  {
    titulo: 'Landing 3D para Marca',
    descripcion: 'Página principal con escenas 3D y scroll parallax suave.',
    tecnologia: 'Three.js + Tailwind',
  },
  {
    titulo: 'Chat en Vivo',
    descripcion: 'Mensajes instantáneos y alerta push al instante.',
    tecnologia: 'Supabase + Vue',
  },
]

const habilidades = [
  { nombre: 'Vue 3', nivel: 95 },
  { nombre: 'Animaciones', nivel: 92 },
  { nombre: 'UI Moderna', nivel: 90 },
  { nombre: 'Integración API', nivel: 88 },
]

const mensajeEstadoSupabase = computed(() =>
  supabaseConfigurado
    ? 'Conectado a Supabase ✅'
    : 'Modo demo activo: agrega variables .env para Supabase'
)

const alternarModoColor = () => {
  store.alternarModo()
}

const crearEfectoEscritura = () => {
  clearInterval(intervaloTypewriter)
  intervaloTypewriter = setInterval(() => {
    if (indiceTexto.value >= textoCompleto.length) {
      clearInterval(intervaloTypewriter)
      return
    }

    textoSobreMi.value += textoCompleto[indiceTexto.value]
    indiceTexto.value += 1
  }, 45)
}

const iniciarParticulas = async () => {
  try {
    await import('particles.js')

    if (!window.particlesJS) {
      return
    }

    window.particlesJS('particulas', {
      particles: {
        number: { value: 45, density: { enable: true, value_area: 900 } },
        color: { value: '#00d4ff' },
        shape: { type: 'circle' },
        opacity: { value: 0.22 },
        size: { value: 2.2, random: true },
        line_linked: { enable: true, distance: 130, color: '#0ea5e9', opacity: 0.22, width: 1 },
        move: { enable: true, speed: 1.1 },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
        },
        modes: {
          grab: { distance: 150, line_linked: { opacity: 0.35 } },
          push: { particles_nb: 3 },
        },
      },
    })
  } catch (error) {
    console.warn('particles.js no pudo inicializarse en este navegador', error)
  }
}

const iniciarEscenaThree = () => {
  const canvas = canvasHero.value
  if (!canvas) {
    return
  }

  const escena = new THREE.Scene()
  const camara = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camara.position.z = 3

  const renderizador = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderizador.setSize(canvas.clientWidth, canvas.clientHeight)

  const geometria = new THREE.TorusKnotGeometry(0.75, 0.23, 120, 14)
  const material = new THREE.MeshStandardMaterial({
    color: '#0ea5e9',
    emissive: '#00d4ff',
    emissiveIntensity: 0.32,
    metalness: 0.5,
    roughness: 0.35,
  })
  const figura = new THREE.Mesh(geometria, material)
  escena.add(figura)

  const luzPrincipal = new THREE.PointLight('#00d4ff', 40, 14)
  luzPrincipal.position.set(2, 2, 2)
  escena.add(luzPrincipal)

  const luzSecundaria = new THREE.AmbientLight('#8b5cf6', 1.5)
  escena.add(luzSecundaria)

  let rotacionObjetivoX = 0
  let rotacionObjetivoY = 0
  let cuadroAnimacion = null

  const actualizarTamano = () => {
    if (!canvas.clientWidth || !canvas.clientHeight) {
      return
    }

    camara.aspect = canvas.clientWidth / canvas.clientHeight
    camara.updateProjectionMatrix()
    renderizador.setSize(canvas.clientWidth, canvas.clientHeight)
  }

  const moverMouse = (evento) => {
    const rect = canvas.getBoundingClientRect()
    const x = (evento.clientX - rect.left) / rect.width
    const y = (evento.clientY - rect.top) / rect.height
    rotacionObjetivoX = (y - 0.5) * 0.8
    rotacionObjetivoY = (x - 0.5) * 0.8
  }

  const animar = () => {
    figura.rotation.x += (rotacionObjetivoX - figura.rotation.x) * 0.04
    figura.rotation.y += 0.008 + (rotacionObjetivoY - figura.rotation.y) * 0.04
    renderizador.render(escena, camara)
    cuadroAnimacion = requestAnimationFrame(animar)
  }

  window.addEventListener('resize', actualizarTamano)
  canvas.addEventListener('mousemove', moverMouse)
  actualizarTamano()
  animar()

  limpiarThree = () => {
    cancelAnimationFrame(cuadroAnimacion)
    window.removeEventListener('resize', actualizarTamano)
    canvas.removeEventListener('mousemove', moverMouse)
    geometria.dispose()
    material.dispose()
    renderizador.dispose()
  }
}

const iniciarCursorPersonalizado = () => {
  const cursor = document.querySelector('.cursor-personalizado')
  if (!cursor) {
    return
  }

  const mover = (evento) => {
    gsap.to(cursor, {
      x: evento.clientX,
      y: evento.clientY,
      duration: 0.18,
      ease: 'power2.out',
    })
  }

  window.addEventListener('mousemove', mover)
  limpiarCursor = () => window.removeEventListener('mousemove', mover)
}

const iniciarAnimacionesScroll = () => {
  gsap.from('.hero-contenido', {
    opacity: 0,
    y: 35,
    duration: 1,
    ease: 'power3.out',
  })

  gsap.to('.hero-3d', {
    yPercent: 18,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })

  gsap.utils.toArray('.seccion').forEach((seccion) => {
    gsap.from(seccion, {
      opacity: 0,
      y: 45,
      duration: 0.8,
      scrollTrigger: {
        trigger: seccion,
        start: 'top 78%',
      },
    })
  })
}

const iniciarAnimeJS = () => {
  animate('.barra-habilidad > span', {
    width: (elemento) => `${elemento.dataset.nivel}%`,
    delay: stagger(140),
    duration: 1200,
    easing: 'easeOutExpo',
  })

  animate('.boton-whatsapp', {
    scale: [1, 1.08, 1],
    duration: 1600,
    loop: true,
    easing: 'easeInOutSine',
  })
}

const prepararEasterEgg = () => {
  const codigo = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ]
  const buffer = []

  const detectar = (evento) => {
    buffer.push(evento.key)
    if (buffer.length > codigo.length) {
      buffer.shift()
    }

    if (buffer.join(',').toLowerCase() === codigo.join(',').toLowerCase()) {
      easterEggActivo.value = true
      animate('.glitch', {
        translateX: [0, -2, 2, 0],
        duration: 360,
      })
    }
  }

  window.addEventListener('keydown', detectar)
  limpiarSecreto = () => window.removeEventListener('keydown', detectar)
}

const enviarMensajeChat = async () => {
  const exito = await store.enviarMensaje(nuevoNombre.value, nuevoMensaje.value)

  if (!exito) {
    return
  }

  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }

  if (Notification.permission === 'granted') {
    new Notification('Nuevo mensaje enviado ✨', {
      body: `${nuevoNombre.value}: ${nuevoMensaje.value}`,
    })
  }

  nuevoMensaje.value = ''
}

const manejarEfectoCard = (evento) => {
  const card = evento.currentTarget
  const rect = card.getBoundingClientRect()
  const x = evento.clientX - rect.left
  const y = evento.clientY - rect.top

  card.style.setProperty('--rot-x', `${((y / rect.height) - 0.5) * -8}deg`)
  card.style.setProperty('--rot-y', `${((x / rect.width) - 0.5) * 8}deg`)
}

const limpiarEfectoCard = (evento) => {
  const card = evento.currentTarget
  card.style.setProperty('--rot-x', '0deg')
  card.style.setProperty('--rot-y', '0deg')
}

watch(
  modoOscuro,
  (valor) => {
    document.documentElement.classList.toggle('dark', valor)
  },
  { immediate: true }
)

onMounted(async () => {
  store.inicializarModo()
  crearEfectoEscritura()
  await iniciarParticulas()
  iniciarEscenaThree()
  iniciarCursorPersonalizado()
  iniciarAnimacionesScroll()
  iniciarAnimeJS()
  prepararEasterEgg()

  await store.incrementarVisitas()
  await store.cargarMensajes()
  desuscribirChat = store.suscribirseMensajes(() => {
    if (Notification.permission === 'granted') {
      new Notification('Nuevo mensaje del chat 💬')
    }
  })
})

onBeforeUnmount(() => {
  clearInterval(intervaloTypewriter)
  desuscribirChat()
  limpiarThree()
  limpiarCursor()
  limpiarSecreto()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})
</script>

<template>
  <div class="cursor-personalizado" />
  <div id="particulas" class="fondo-particulas" />

  <main class="app-principal min-h-screen text-slate-200">
    <header class="encabezado sticky top-0 z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
      <p class="text-sm font-semibold tracking-wider text-cyan-300">FREDY DEV</p>
      <button
        type="button"
        class="boton-neon rounded-full border border-cyan-400/40 px-4 py-2 text-xs"
        @click="alternarModoColor"
      >
        {{ modoOscuro ? 'Modo claro' : 'Modo oscuro' }}
      </button>
    </header>

    <section class="hero seccion mx-auto grid w-full max-w-6xl gap-6 px-4 pb-10 pt-10 md:grid-cols-2 md:items-center">
      <div class="hero-contenido">
        <p class="mb-2 text-sm uppercase tracking-widest text-sky-300">Portafolio Full Frontend</p>
        <h1 class="glitch text-4xl font-bold leading-tight md:text-6xl" data-text="Bien cool, bien loco">
          Bien cool, bien loco
        </h1>
        <p class="mt-4 text-slate-300">
          Diseño moderno + animación + rendimiento profesional.
        </p>
        <div class="mt-6 flex flex-wrap gap-3 text-sm">
          <span class="chip">Visitas: {{ visitas }}</span>
          <span class="chip">{{ mensajeEstadoSupabase }}</span>
        </div>
      </div>

      <div class="hero-3d rounded-3xl border border-cyan-400/20 bg-slate-900/30 p-3 backdrop-blur-md">
        <canvas ref="canvasHero" class="h-72 w-full md:h-96" />
      </div>
    </section>

    <section class="seccion mx-auto w-full max-w-6xl px-4 py-8">
      <h2 class="titulo-seccion">Sobre mí</h2>
      <p class="typewriter mt-4 text-slate-300">{{ textoSobreMi }}</p>
    </section>

    <section class="seccion mx-auto w-full max-w-6xl px-4 py-8">
      <h2 class="titulo-seccion">Proyectos</h2>
      <div class="mt-5 grid gap-4 md:grid-cols-3">
        <article
          v-for="proyecto in proyectos"
          :key="proyecto.titulo"
          class="card-vidrio"
          @mousemove="manejarEfectoCard"
          @mouseleave="limpiarEfectoCard"
        >
          <h3 class="text-lg font-semibold text-sky-200">{{ proyecto.titulo }}</h3>
          <p class="mt-2 text-sm text-slate-300">{{ proyecto.descripcion }}</p>
          <p class="mt-4 text-xs uppercase tracking-widest text-cyan-300">{{ proyecto.tecnologia }}</p>
        </article>
      </div>
    </section>

    <section class="seccion mx-auto w-full max-w-6xl px-4 py-8">
      <h2 class="titulo-seccion">Habilidades</h2>
      <div class="mt-5 space-y-4">
        <div v-for="habilidad in habilidades" :key="habilidad.nombre" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>{{ habilidad.nombre }}</span>
            <span>{{ habilidad.nivel }}%</span>
          </div>
          <div class="barra-habilidad"><span :data-nivel="habilidad.nivel" /></div>
        </div>
      </div>
    </section>

    <section class="seccion mx-auto w-full max-w-6xl px-4 py-8">
      <h2 class="titulo-seccion">Chat en tiempo real</h2>
      <form class="mt-4 grid gap-3 md:grid-cols-3" @submit.prevent="enviarMensajeChat">
        <input
          v-model="nuevoNombre"
          type="text"
          maxlength="40"
          placeholder="Tu nombre"
          class="input-chat"
          required
        />
        <input
          v-model="nuevoMensaje"
          type="text"
          maxlength="220"
          placeholder="Tu mensaje"
          class="input-chat md:col-span-2"
          required
        />
        <button type="submit" class="boton-neon md:col-span-3">Enviar mensaje</button>
      </form>
      <p v-if="errorChat" class="mt-3 text-sm text-emerald-400">{{ errorChat }}</p>

      <ul class="mt-5 space-y-3">
        <li v-if="cargandoChat" class="text-sm text-slate-400">Cargando chat...</li>
        <li v-for="mensaje in mensajes" :key="mensaje.id" class="mensaje-chat">
          <strong>{{ mensaje.nombre }}:</strong> {{ mensaje.mensaje }}
        </li>
      </ul>
    </section>

    <footer class="seccion mx-auto w-full max-w-6xl px-4 py-10">
      <h2 class="titulo-seccion">Redes</h2>
      <div class="mt-4 flex flex-wrap gap-3 text-sm">
        <a href="https://github.com" target="_blank" rel="noopener" class="chip">GitHub</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener" class="chip">LinkedIn</a>
        <a href="https://x.com" target="_blank" rel="noopener" class="chip">X</a>
      </div>
      <p v-if="easterEggActivo" class="mt-6 text-cyan-300">🎉 Easter egg desbloqueado: ¡modo leyenda!</p>
    </footer>

    <a
      class="boton-whatsapp"
      href="https://wa.me/573001234567"
      target="_blank"
      rel="noopener"
      aria-label="Contactar por WhatsApp"
    >
      WhatsApp
    </a>
  </main>
</template>
