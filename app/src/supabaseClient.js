// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Leemos las variables de entorno definidas en .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key';

// Pequeña validación por si falta algo
if (supabaseUrl === 'https://tu-proyecto.supabase.co') {
  console.error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en tu archivo .env.local'
  );
}

// Creamos una única instancia del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);