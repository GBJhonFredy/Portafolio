import { createClient } from '@supabase/supabase-js'

const urlSupabase = import.meta.env.VITE_SUPABASE_URL
const llaveSupabase = import.meta.env.VITE_SUPABASE_ANON_KEY

export const clienteSupabase =
  urlSupabase && llaveSupabase ? createClient(urlSupabase, llaveSupabase) : null

export const supabaseConfigurado = Boolean(clienteSupabase)
