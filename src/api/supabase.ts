import { createClient } from '@supabase/supabase-js'

// These will need to be replaced with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  return { user: data?.user, error }
}

// Profile helpers
export const createProfile = async (userId: string, username: string, avatarUrl?: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ user_id: userId, username, avatar_url: avatarUrl }])
    .select()

  return { data, error }
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single()

  return { profile: data, error }
}

export const checkUsernameAvailable = async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)

  return { available: !data?.length, error }
}
