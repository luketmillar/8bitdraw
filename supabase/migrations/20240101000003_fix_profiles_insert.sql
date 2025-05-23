-- Add missing INSERT policy for profiles table
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Add a policy to make profiles publicly readable
-- This is useful for showing usernames/avatars on published drawings
CREATE POLICY "Anyone can view public profile information" 
  ON public.profiles FOR SELECT 
  USING (true); 