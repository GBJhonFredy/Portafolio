// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Leemos las variables de entorno definidas en .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Pequeña validación por si falta algo
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en tu archivo .env.local'
  );
}

// Creamos una única instancia del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);