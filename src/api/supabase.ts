import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'
import type { DrawingData } from '../types/supabase'

// These will need to be replaced with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

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
    .insert([{ id: userId, username, avatar_url: avatarUrl }])
    .select()

  return { data, error }
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  return { profile: data, error }
}

export const checkUsernameAvailable = async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)

  return { available: !data?.length, error }
}

// Profile avatar upload
export const uploadAvatar = async (userId: string, file: File) => {
  // Create a unique file path for the avatar
  const fileExt = file.name.split('.').pop()
  const filePath = `avatars/${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`

  // Upload the file to Supabase Storage
  const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

  if (uploadError) {
    return { avatarUrl: null, error: uploadError }
  }

  // Get the public URL for the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath)

  // Update the user's profile with the new avatar URL
  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)
    .select()
    .single()

  return { avatarUrl: publicUrl, profile: data, error }
}

// Drawing helpers
export const createDrawing = async (
  userId: string,
  name: string,
  description?: string,
  remixOfId?: string
) => {
  const { data: drawing, error: drawingError } = await supabase
    .from('drawings')
    .insert([
      {
        user_id: userId,
        name,
        description,
        is_remix_of: remixOfId || null,
      },
    ])
    .select()
    .single()

  if (drawingError || !drawing) {
    return { drawing: null, error: drawingError }
  }

  // Create initial empty drawing data
  const initialData = {
    layers: [
      {
        id: 'layer-1',
        name: 'Layer 1',
        visible: true,
        locked: false,
        opacity: 1,
        pixels: {},
      },
    ],
    palette: [
      '#000000',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#00FFFF',
      '#FF00FF',
    ],
  }

  const { error: dataError } = await supabase.from('drawing_data').insert([
    {
      drawing_id: drawing.id,
      data: initialData,
      version: 1,
    },
  ])

  return { drawing, error: dataError }
}

export const getDrawing = async (drawingId: string) => {
  const { data, error } = await supabase.from('drawings').select('*').eq('id', drawingId).single()

  return { drawing: data, error }
}

export const getDrawingWithData = async (drawingId: string) => {
  const { data: drawing, error: drawingError } = await supabase
    .from('drawings')
    .select('*')
    .eq('id', drawingId)
    .single()

  if (drawingError || !drawing) {
    return { drawing: null, drawingData: null, error: drawingError }
  }

  const { data: drawingData, error: dataError } = await supabase
    .from('drawing_data')
    .select('*')
    .eq('drawing_id', drawingId)
    .order('version', { ascending: false })
    .limit(1)
    .single()

  return { drawing, drawingData, error: dataError }
}

export const updateDrawingData = async (
  drawingId: string,
  data: DrawingData['data'],
  version: number
) => {
  const { data: result, error } = await supabase
    .from('drawing_data')
    .insert([
      {
        drawing_id: drawingId,
        data,
        version,
      },
    ])
    .select()

  return { data: result, error }
}

export const getUserDrawings = async (userId: string) => {
  const { data, error } = await supabase
    .from('drawings')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  return { drawings: data, error }
}

export const publishDrawing = async (drawingId: string) => {
  const { data, error } = await supabase
    .from('drawings')
    .update({ published_at: new Date().toISOString() })
    .eq('id', drawingId)
    .select()
    .single()

  return { drawing: data, error }
}

export const unpublishDrawing = async (drawingId: string) => {
  const { data, error } = await supabase
    .from('drawings')
    .update({ published_at: null })
    .eq('id', drawingId)
    .select()
    .single()

  return { drawing: data, error }
}

export const deleteDrawing = async (drawingId: string) => {
  const { error } = await supabase.from('drawings').delete().eq('id', drawingId)

  return { error }
}

export const getPublishedDrawings = async (limit = 20, orderBy = 'published_at') => {
  // Define the order parameter based on the orderBy value
  const orderParam =
    orderBy === 'score' ? 'score' : orderBy === 'upvotes' ? 'upvote_count' : 'published_at'

  const { data, error } = await supabase
    .from('drawings')
    .select('*, profiles(username, avatar_url)')
    .not('published_at', 'is', null)
    .order(orderParam, { ascending: false })
    .limit(limit)

  return { drawings: data, error }
}

export const getRemixesOfDrawing = async (drawingId: string, limit = 20) => {
  const { data, error } = await supabase
    .from('drawings')
    .select('*, profiles(username, avatar_url)')
    .eq('is_remix_of', drawingId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { remixes: data, error }
}

// Vote helpers (replacing like helpers)
export const upvoteDrawing = async (userId: string, drawingId: string) => {
  const { error } = await supabase.rpc('apply_vote', {
    user_id: userId,
    drawing_id: drawingId,
    vote_type: 'upvote',
  })

  return { success: !error, error }
}

export const downvoteDrawing = async (userId: string, drawingId: string) => {
  const { error } = await supabase.rpc('apply_vote', {
    user_id: userId,
    drawing_id: drawingId,
    vote_type: 'downvote',
  })

  return { success: !error, error }
}

export const removeVote = async (userId: string, drawingId: string) => {
  const { error } = await supabase.rpc('remove_vote', {
    user_id: userId,
    drawing_id: drawingId,
  })

  return { success: !error, error }
}

export const getUserVote = async (userId: string, drawingId: string) => {
  const { data, error } = await supabase
    .from('votes')
    .select('vote_type')
    .match({ user_id: userId, drawing_id: drawingId })
    .single()

  return { voteType: data?.vote_type, error }
}

// Winner helpers
export const getDailyWinners = async (limit = 7) => {
  const { data, error } = await supabase
    .from('winners')
    .select('*, drawings(*), drawings(profiles(username, avatar_url))')
    .eq('category', 'daily')
    .order('end_date', { ascending: false })
    .limit(limit)

  return { winners: data, error }
}

export const getWeeklyWinners = async (limit = 4) => {
  const { data, error } = await supabase
    .from('winners')
    .select('*, drawings(*), drawings(profiles(username, avatar_url))')
    .eq('category', 'weekly')
    .order('end_date', { ascending: false })
    .limit(limit)

  return { winners: data, error }
}

export const getCurrentDayLeaderboard = async (limit = 10) => {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('drawings')
    .select('*, profiles(username, avatar_url)')
    .not('published_at', 'is', null)
    .gte('published_at', `${today}T00:00:00`)
    .lte('published_at', `${today}T23:59:59`)
    .order('score', { ascending: false })
    .limit(limit)

  return { drawings: data, error }
}

export const getCurrentWeekLeaderboard = async (limit = 10) => {
  // Calculate start of week (Monday)
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('drawings')
    .select('*, profiles(username, avatar_url)')
    .not('published_at', 'is', null)
    .gte('published_at', monday.toISOString())
    .order('score', { ascending: false })
    .limit(limit)

  return { drawings: data, error }
}
