import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { supabase } from '../../supabaseClient';

// Columna real del texto del mensaje
const MESSAGE_COLUMN = 'visitor_message';

export function useReplyMessenger() {
  const users = ref([]);
  const selectedUserId = ref(null);
  const selectedUser = computed(() =>
    users.value.find(u => u.id === selectedUserId.value) || null
  );

  const messages = ref([]);
  const replyText = ref('');
  const loadingUsers = ref(false);
  const loadingMessages = ref(false);
  const sendingReply = ref(false);
  const errorMessage = ref('');

  // Session_id actual (para que el visitante vea la respuesta)
  const currentSessionId = ref(null);

  // Canal Realtime para este panel
  let realtimeChannel = null;

  // Helper para mapear mensajes a lo que la vista usa
  const mapMessage = (m) => {
    const baseText = m[MESSAGE_COLUMN];
    return {
      id: m.id,
      from: m.is_reply ? 'Tú' : (selectedUser.value?.name || 'Usuario'),
      text: m.is_reply ? (m.owner_reply || baseText) : baseText,
      isReply: m.is_reply,
      created_at: m.created_at,
      session_id: m.session_id || null,
      user_id: m.user_id,
    };
  };

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      loadingUsers.value = true;
      errorMessage.value = '';

      const { data, error } = await supabase
        .from('messenger_users')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando usuarios:', error);
        errorMessage.value = 'No se pudieron cargar los usuarios.';
        return;
      }

      users.value = data || [];

      if (users.value.length > 0) {
        const jhon = users.value.find(
          u => u.name && u.name.toLowerCase().includes('jhon gil')
        );
        if (jhon) {
          selectedUserId.value = jhon.id;
        } else {
          selectedUserId.value = users.value[0].id;
        }
      }
    } catch (err) {
      console.error('Error inesperado cargando usuarios:', err);
      errorMessage.value = 'Error inesperado al cargar usuarios.';
    } finally {
      loadingUsers.value = false;
    }
  };

  // Buscar un session_id para este user_id
  const loadSessionIdForUser = async () => {
    currentSessionId.value = null;
    if (!selectedUserId.value) return;

    try {
      // Buscamos el último mensaje de este usuario que tenga session_id
      const { data, error } = await supabase
        .from('messages')
        .select('session_id')
        .eq('user_id', selectedUserId.value)
        .not('session_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error cargando session_id:', error);
        return;
      }

      if (data && data.length > 0) {
        currentSessionId.value = data[0].session_id;
      }
    } catch (err) {
      console.error('Error inesperado cargando session_id:', err);
    }
  };

  // Cargar mensajes del usuario seleccionado
  const loadMessages = async () => {
    if (!selectedUserId.value) {
      messages.value = [];
      return;
    }

    try {
      loadingMessages.value = true;
      errorMessage.value = '';

      // Primero aseguramos session_id (por si no lo tenemos aún)
      await loadSessionIdForUser();

      let query = supabase
        .from('messages')
        .select(
          `id, user_id, ${MESSAGE_COLUMN}, is_reply, owner_reply, created_at, session_id`,
        )
        .order('created_at', { ascending: true });

      if (currentSessionId.value) {
        // Traemos todo lo que tenga ese user_id o ese session_id
        query = query.or(
          `user_id.eq.${selectedUserId.value},session_id.eq.${currentSessionId.value}`,
        );
      } else {
        query = query.eq('user_id', selectedUserId.value);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error cargando mensajes:', error);
        errorMessage.value = 'No se pudieron cargar los mensajes.';
        return;
      }

      messages.value = (data || []).map(mapMessage);
    } catch (err) {
      console.error('Error inesperado cargando mensajes:', err);
      errorMessage.value = 'Error inesperado al cargar mensajes.';
    } finally {
      loadingMessages.value = false;
    }
  };

  // Enviar respuesta
  const sendReply = async () => {
    if (!selectedUserId.value || !replyText.value.trim()) return;

    try {
      sendingReply.value = true;
      errorMessage.value = '';

      const textToSend = replyText.value.trim();

      const insertPayload = {
        user_id: selectedUserId.value,
        visitor_name: 'Owner',
        [MESSAGE_COLUMN]: textToSend,
        is_reply: true,
        owner_reply: textToSend,
      };

      // Si conocemos el session_id de este usuario, lo incluimos
      if (currentSessionId.value) {
        insertPayload.session_id = currentSessionId.value;
      }

      const { error } = await supabase
        .from('messages')
        .insert([insertPayload]);

      if (error) {
        console.error('Error enviando respuesta:', error);
        errorMessage.value = 'No se pudo enviar la respuesta.';
        return;
      }

      // No hace falta recargar todo si tenemos Realtime:
      // pero por seguridad podemos recargar una vez
      await loadMessages();

      replyText.value = '';
    } catch (err) {
      console.error('Error inesperado enviando respuesta:', err);
      errorMessage.value = 'Error inesperado al enviar respuesta.';
    } finally {
      sendingReply.value = false;
    }
  };

  // Configurar Realtime para este panel
  const setupRealtime = () => {
    // Si ya había un canal, lo quitamos
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }

    if (!selectedUserId.value && !currentSessionId.value) return;

    // Filtramos por user_id y/o session_id
    const filters = [];
    if (selectedUserId.value) {
      filters.push(`user_id=eq.${selectedUserId.value}`);
    }
    if (currentSessionId.value) {
      filters.push(`session_id=eq.${currentSessionId.value}`);
    }

    // Si por alguna razón no hay filtros, no suscribimos
    if (!filters.length) return;

    const filterString = filters.join(',');

    realtimeChannel = supabase
      .channel('reply_messenger_admin')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: filterString,
        },
        (payload) => {
          const newMsg = payload.new;
          if (!newMsg) return;

          // Evitar duplicados
          if (!messages.value.some(m => m.id === newMsg.id)) {
            messages.value.push(mapMessage(newMsg));
          }
        },
      )
      .subscribe((status) => {
        console.log('Realtime admin status:', status);
      });
  };

  // Watch para usuario seleccionado: recarga mensajes y reconfigura Realtime
  watch(selectedUserId, async () => {
    await loadMessages();
    setupRealtime();
  });

  // Montaje: carga usuarios y mensajes iniciales, y configura realtime
  onMounted(async () => {
    await loadUsers();
    await loadMessages();
    setupRealtime();
  });

  // Limpieza
  onUnmounted(() => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }
  });

  return {
    users,
    selectedUserId,
    selectedUser,
    messages,
    replyText,
    loadingUsers,
    loadingMessages,
    sendingReply,
    errorMessage,
    init: async () => {
      await loadUsers();
      await loadMessages();
      setupRealtime();
    },
    loadUsers,
    loadMessages,
    sendReply,
  };
}