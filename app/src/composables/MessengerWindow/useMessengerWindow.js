import { ref, onMounted, onUnmounted } from 'vue';
import { useWindowManager } from '../shared/useWindowManager';
import { supabase } from '../../supabaseClient';
import { useMessengerUser } from './useMessengerUser';

export function useMessengerWindow() {
  // Gestionar la ventana (posición, tamaño, maximizar)
  const windowManager = useWindowManager(
    {
      defaultWidth: '320px',
      defaultHeight: '500px',
      defaultX: 100,
      defaultY: 50,
      maxWidth: '800px',
      maxHeight: '800px',
    },
    'messenger',
  );

  // Estado general
  const status = ref('Disponible');
  const messages = ref([]);
  const currentInput = ref('');
  const isConnecting = ref(true); // true mientras reconectamos / suscribimos

  // “Login” sencillo del visitante
  const visitorName = ref('');
  const visitorEmail = ref('');
  const isSetup = ref(false); // decide si mostrar login o chat

  // Usuario del Messenger (tabla messenger_users)
  const { currentUserId, connectVisitor } = useMessengerUser();

  // Realtime
  let realtimeChannel = null;

  // Generar o recuperar ID de sesión único para el visitante anónimo
  const getSessionId = () => {
    let sid = localStorage.getItem('messenger-session-id');
    if (!sid) {
      sid =
        'session_' +
        Math.random().toString(36).substr(2, 9) +
        Date.now().toString(36);
      localStorage.setItem('messenger-session-id', sid);
    }
    return sid;
  };

  const sessionId = getSessionId();

  // Helpers para mapear mensajes
  const mapMessage = (m) => {
    if (m.is_reply) {
      // Mensaje del admin / owner
      return {
        id: m.id,
        from: 'Portafolio', // o 'Admin', o tu nombre
        text: m.owner_reply || m.visitor_message,
        isReply: true,
      };
    }

    // Mensaje del visitante
    return {
      id: m.id,
      from: m.visitor_name || visitorName.value || 'Tú',
      text: m.visitor_message,
      isReply: false,
    };
  };

  // Cargar mensajes de esta sesión (visitante + admin)
  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(
          'id, visitor_name, visitor_message, visitor_email, session_id, is_reply, owner_reply, user_id, created_at',
        )
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error cargando mensajes:', error);
        return;
      }

      if (data) {
        messages.value = data.map(mapMessage);
      }
    } catch (err) {
      console.error('Error inesperado cargando mensajes:', err);
    }
  };

  // Suscripción Realtime solo a mensajes de esta sesión
  const setupRealtime = () => {
    // Por si ya existía
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }

    realtimeChannel = supabase
      .channel('messenger_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          if (!newMsg) return;

          // Evitar duplicados
          if (!messages.value.some((m) => m.id === newMsg.id)) {
            messages.value.push(mapMessage(newMsg));
          }
        },
      )
      .subscribe((state) => {
        console.log('Estado de conexión Realtime Messenger:', state);
        if (state === 'SUBSCRIBED') isConnecting.value = false;
        if (state === 'CHANNEL_ERROR') {
          console.error(
            'Error en el canal de Realtime. Revisa que la tabla messages tenga Realtime activado.',
          );
        }
      });
  };

  // Este es el que tu plantilla llama como "startChat"
  const startChat = async () => {
    if (visitorName.value.trim() === '') {
      alert('Por favor, ingresa al menos tu nombre para conectar.');
      return;
    }

    // Guardar nombre/email para futuras visitas
    localStorage.setItem('messenger-name', visitorName.value);
    if (visitorEmail.value) {
      localStorage.setItem('messenger-email', visitorEmail.value);
    }

    isConnecting.value = true;

    // Crear o reutilizar usuario en messenger_users
    const { userId, error } = await connectVisitor({
      name: visitorName.value,
      email: visitorEmail.value,
      sessionId, // ← AQUÍ le pasamos el sessionId
    });

    if (error || !userId) {
      console.error('connectVisitor devolvió error:', error);
      alert('No se pudo conectar el usuario. Inténtalo de nuevo más tarde.');
      isConnecting.value = false;
      return;
    }

    console.log('Visitor conectado con user_id:', userId);
    isSetup.value = true;
    status.value = 'Disponible';

    await loadMessages();
    setupRealtime();
  };

  // Enviar mensaje
  const sendMessage = async () => {
    const text = currentInput.value.trim();
    if (text === '') return;

    // No dejar enviar si todavía no está listo el chat
    if (!isSetup.value || isConnecting.value || !currentUserId.value) {
      alert('Espera un momento, todavía estamos conectando el chat. Intenta de nuevo.');
      return;
    }

    // Limpiar input
    currentInput.value = '';

    // Inserción optimista
    const tempId = Date.now();
    messages.value.push({
      id: tempId,
      from: 'Tú',
      text,
      isReply: false,
    });

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            visitor_name: visitorName.value || 'Visitante',
            visitor_message: text,
            visitor_email: visitorEmail.value || null,
            session_id: sessionId,
            is_reply: false,
            owner_reply: null,
            user_id: currentUserId.value, // aquí ya exigimos que exista
          },
        ])
        .select(
          'id, visitor_name, visitor_message, visitor_email, session_id, is_reply, owner_reply, user_id, created_at',
        )
        .single();

      if (error) {
        console.error('Error enviando mensaje. Detalles:', error);
        alert('No se pudo enviar el mensaje: ' + error.message);
        // Quitar el mensaje temporal si falla
        messages.value = messages.value.filter((m) => m.id !== tempId);
      } else if (data) {
        // Reemplazar el id temporal por el real y asegurar formato
        const idx = messages.value.findIndex((m) => m.id === tempId);
        if (idx !== -1) {
          messages.value[idx] = mapMessage(data);
        }
      }
    } catch (err) {
      console.error('Error inesperado enviando mensaje:', err);
      alert('Ocurrió un error inesperado al enviar el mensaje.');
      messages.value = messages.value.filter((m) => m.id !== tempId);
    }
  };

  // Montaje
  onMounted(async () => {
    // Centrar ventana si no tiene posición guardada
    if (!localStorage.getItem('window-pos-messenger')) {
      windowManager.centerWindow();
    }

    // Recuperar datos de visitante si ya había escrito antes
    const storedName = localStorage.getItem('messenger-name');
    const storedEmail = localStorage.getItem('messenger-email') || '';

    if (storedName) {
      visitorName.value = storedName;
      visitorEmail.value = storedEmail;

      // Intentar reconectar automáticamente al usuario
      try {
        const { userId, error } = await connectVisitor({
          name: storedName,
          email: storedEmail,
          sessionId, // ← AQUÍ también le pasamos el sessionId
        });

        if (!error && userId) {
          console.log('Visitor reconectado con user_id:', userId);
          isSetup.value = true;
          status.value = 'Disponible';
        } else {
          console.error('Error al reconectar visitante:', error);
        }
      } catch (err) {
        console.error('Error inesperado al reconectar visitante:', err);
      }
    }

    await loadMessages();
    setupRealtime();
    // Cuando el canal Realtime se suscriba, isConnecting se pondrá en false
  });

  // Limpieza
  onUnmounted(() => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }
  });

  return {
    // from useWindowManager
    ...windowManager,
    // estado de conexión
    isConnecting,
    // estado propio del messenger
    status,
    messages,
    currentInput,
    isSetup,
    visitorName,
    visitorEmail,
    startChat,
    sendMessage,
  };
}