import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service_role key — bypasses RLS for backend operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase
