export type Profile = {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Drawing = {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  is_remix_of: string | null
  view_count: number
  upvote_count: number
  downvote_count: number
  score: number
}

export type DrawingData = {
  id: string
  drawing_id: string
  data: {
    layers: Array<{
      id: string
      name: string
      visible: boolean
      locked: boolean
      opacity: number
      pixels: Record<string, string> // position -> color
    }>
    palette: string[]
  }
  version: number
  created_at: string
  updated_at: string
}

export type Vote = {
  user_id: string
  drawing_id: string
  vote_type: 'upvote' | 'downvote'
  created_at: string
  updated_at: string
}

export type Winner = {
  id: string
  drawing_id: string
  category: 'daily' | 'weekly'
  start_date: string
  end_date: string
  score: number
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      drawings: {
        Row: Drawing
        Insert: Omit<
          Drawing,
          | 'id'
          | 'created_at'
          | 'updated_at'
          | 'view_count'
          | 'upvote_count'
          | 'downvote_count'
          | 'score'
        >
        Update: Partial<Omit<Drawing, 'id' | 'user_id' | 'created_at'>>
      }
      drawing_data: {
        Row: DrawingData
        Insert: Omit<DrawingData, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DrawingData, 'id' | 'drawing_id' | 'created_at'>>
      }
      votes: {
        Row: Vote
        Insert: Omit<Vote, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Vote, 'user_id' | 'drawing_id' | 'created_at'>>
      }
      winners: {
        Row: Winner
        Insert: Omit<Winner, 'id' | 'created_at'>
        Update: never
      }
    }
  }
}
