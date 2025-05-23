-- Create public schema tables for pixel art editor app

-- USERS TABLE
-- Note: Auth users are automatically created by Supabase Auth
-- This profiles table extends the auth.users table

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT, -- URL to user's uploaded profile picture in storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

-- DRAWINGS TABLE
CREATE TABLE public.drawings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE, -- Null means unpublished
  is_remix_of UUID REFERENCES public.drawings(id) ON DELETE SET NULL, -- Null means original drawing
  view_count INTEGER DEFAULT 0 NOT NULL,
  upvote_count INTEGER DEFAULT 0 NOT NULL,
  downvote_count INTEGER DEFAULT 0 NOT NULL,
  score INTEGER DEFAULT 0 NOT NULL -- Net score (upvotes - downvotes)
);

-- DRAWING DATA TABLE (Stores the actual pixel data)
-- Kept separate from drawings table for:
-- 1. Performance - metadata is accessed more frequently than pixel data
-- 2. Version history - allows storing multiple versions of the same drawing
-- 3. Size efficiency - pixel data can be large, and we don't need to load it for listing drawings
CREATE TABLE public.drawing_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drawing_id UUID REFERENCES public.drawings(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL, -- Stores layers, pixels, colors, etc.
  version INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- VOTES TABLE (replaces the LIKES table)
CREATE TABLE public.votes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  drawing_id UUID REFERENCES public.drawings(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, drawing_id)
);

-- WINNERS TABLE (for tracking daily and weekly winners)
CREATE TABLE public.winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drawing_id UUID REFERENCES public.drawings(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('daily', 'weekly', 'monthly', 'yearly', 'all-time')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drawing_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Drawing policies
CREATE POLICY "Public drawings are viewable by everyone" 
  ON public.drawings FOR SELECT 
  USING (published_at IS NOT NULL);

CREATE POLICY "Users can view their own drawings" 
  ON public.drawings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drawings" 
  ON public.drawings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drawings" 
  ON public.drawings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drawings" 
  ON public.drawings FOR DELETE 
  USING (auth.uid() = user_id);

-- Drawing data policies
CREATE POLICY "Users can access drawing data for their own drawings" 
  ON public.drawing_data FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.drawings WHERE id = drawing_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can access drawing data for published drawings" 
  ON public.drawing_data FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.drawings WHERE id = drawing_id AND published_at IS NOT NULL
  ));

-- Votes policies
CREATE POLICY "Users can vote on any published drawing" 
  ON public.votes FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.drawings WHERE id = drawing_id AND published_at IS NOT NULL
  ));

CREATE POLICY "Users can change their votes" 
  ON public.votes FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can remove their votes" 
  ON public.votes FOR DELETE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can view votes for published drawings" 
  ON public.votes FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.drawings WHERE id = drawing_id AND published_at IS NOT NULL
  ));

-- Winners policies (everyone can view winners)
CREATE POLICY "Winners are viewable by everyone" 
  ON public.winners FOR SELECT 
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_drawings_user_id ON public.drawings(user_id);
CREATE INDEX idx_drawings_published_at ON public.drawings(published_at);
CREATE INDEX idx_drawings_score ON public.drawings(score);
CREATE INDEX idx_drawing_data_drawing_id ON public.drawing_data(drawing_id);
CREATE INDEX idx_votes_drawing_id ON public.votes(drawing_id);
CREATE INDEX idx_votes_user_drawing ON public.votes(user_id, drawing_id);
CREATE INDEX idx_winners_category_date ON public.winners(category, end_date); 