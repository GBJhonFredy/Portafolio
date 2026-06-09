import { ref } from 'vue';
import { supabase } from '../../supabaseClient';

// Maneja el usuario del Messenger (tabla messenger_users)
export function useMessengerUser() {
  const currentUserId = ref(null);

  // Se llama cuando el visitante pulsa "Conectar" o cuando reconectamos
  // Recibe name, email y sessionId
  async function connectVisitor({ name, email, sessionId }) {
    try {
      console.log('connectVisitor called with:', { name, email, sessionId });

      let userId = null;

      // 1. Primero intentamos encontrar usuario por session_id
      if (sessionId) {
        const { data: existingBySession, error: selectSessionError } = await supabase
          .from('messenger_users')
          .select('id')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (selectSessionError) {
          console.error('Error buscando usuario por session_id:', selectSessionError);
        }

        if (existingBySession && existingBySession.id) {
          userId = existingBySession.id;
          console.log('Usuario existente encontrado por session_id con id:', userId);
        }
      }

      // 2. Si no lo encontramos por session_id pero SÍ hay email, intentamos por email
      if (!userId && email) {
        const { data: existingByEmail, error: selectEmailError } = await supabase
          .from('messenger_users')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (selectEmailError) {
          console.error('Error buscando usuario existente por email:', selectEmailError);
        }

        if (existingByEmail && existingByEmail.id) {
          userId = existingByEmail.id;
          console.log('Usuario existente encontrado por email con id:', userId);
        }
      }

      // 3. Si aún no hay userId, creamos uno nuevo
      if (!userId) {
        const { data, error: insertError } = await supabase
          .from('messenger_users')
          .insert([
            {
              name: name || 'Visitante',
              email: email || null,
              session_id: sessionId || null, // ← aquí se guarda
            },
          ])
          .select('id')
          .single();

        if (insertError) {
          console.error('Error creando messenger_user:', insertError);
          throw insertError;
        }

        userId = data.id;
        console.log('Nuevo usuario creado con id:', userId);
      }

      currentUserId.value = userId;
      return { userId, error: null };
    } catch (err) {
      console.error('Error en connectVisitor (catch):', err);
      return { userId: null, error: err };
    }
  }

  return {
    currentUserId,
    connectVisitor,
  };
}