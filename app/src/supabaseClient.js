// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Leemos las variables de entorno definidas en .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bmysisduhxatxbfjckyc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ozj1tTET-KL5us0GZeyQkw_s6RCIpjZ';

// Pequeña validación por si falta algo
if (supabaseUrl === 'https://bmysisduhxatxbfjckyc.supabase.co') {
  console.error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en tu archivo .env.local'
  );
}

// Creamos una única instancia del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);