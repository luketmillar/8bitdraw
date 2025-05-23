-- Functions for voting operations

-- Function to apply vote (handles upvotes and downvotes)
CREATE OR REPLACE FUNCTION apply_vote(
  user_id UUID, 
  drawing_id UUID, 
  vote_type TEXT
)
RETURNS void AS $$
DECLARE
  current_vote TEXT;
BEGIN
  -- Check if user already voted on this drawing
  SELECT v.vote_type INTO current_vote
  FROM public.votes v
  WHERE v.user_id = apply_vote.user_id AND v.drawing_id = apply_vote.drawing_id;

  IF current_vote IS NULL THEN
    -- User hasn't voted yet, insert new vote
    INSERT INTO public.votes (user_id, drawing_id, vote_type)
    VALUES (apply_vote.user_id, apply_vote.drawing_id, apply_vote.vote_type);

    -- Update the drawing counts
    IF vote_type = 'upvote' THEN
      UPDATE public.drawings
      SET upvote_count = upvote_count + 1,
          score = score + 1
      WHERE id = apply_vote.drawing_id;
    ELSE
      UPDATE public.drawings
      SET downvote_count = downvote_count + 1,
          score = score - 1
      WHERE id = apply_vote.drawing_id;
    END IF;
  ELSIF current_vote != vote_type THEN
    -- User is changing their vote
    UPDATE public.votes
    SET vote_type = apply_vote.vote_type,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE user_id = apply_vote.user_id AND drawing_id = apply_vote.drawing_id;

    -- Update the drawing counts
    IF vote_type = 'upvote' THEN
      UPDATE public.drawings
      SET upvote_count = upvote_count + 1,
          downvote_count = downvote_count - 1,
          score = score + 2  -- +1 for upvote, +1 for removing downvote
      WHERE id = apply_vote.drawing_id;
    ELSE
      UPDATE public.drawings
      SET upvote_count = upvote_count - 1,
          downvote_count = downvote_count + 1,
          score = score - 2  -- -1 for downvote, -1 for removing upvote
      WHERE id = apply_vote.drawing_id;
    END IF;
  END IF;
  -- If same vote type, do nothing
END;
$$ LANGUAGE plpgsql;

-- Function to remove vote
CREATE OR REPLACE FUNCTION remove_vote(user_id UUID, drawing_id UUID)
RETURNS void AS $$
DECLARE
  current_vote TEXT;
BEGIN
  -- Get the current vote type
  SELECT v.vote_type INTO current_vote
  FROM public.votes v
  WHERE v.user_id = remove_vote.user_id AND v.drawing_id = remove_vote.drawing_id;

  -- Remove the vote
  DELETE FROM public.votes
  WHERE user_id = remove_vote.user_id AND drawing_id = remove_vote.drawing_id;

  -- Update the drawing counts
  IF current_vote = 'upvote' THEN
    UPDATE public.drawings
    SET upvote_count = GREATEST(0, upvote_count - 1),
        score = score - 1
    WHERE id = remove_vote.drawing_id;
  ELSIF current_vote = 'downvote' THEN
    UPDATE public.drawings
    SET downvote_count = GREATEST(0, downvote_count - 1),
        score = score + 1
    WHERE id = remove_vote.drawing_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and store daily winners
CREATE OR REPLACE FUNCTION calculate_daily_winners(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS void AS $$
BEGIN
  -- Delete any existing winners for this date to avoid duplicates
  DELETE FROM public.winners 
  WHERE category = 'daily' AND start_date = target_date;
  
  -- Insert the new daily winner
  INSERT INTO public.winners (drawing_id, category, start_date, end_date, score)
  SELECT 
    d.id,
    'daily',
    target_date,
    target_date,
    d.score
  FROM public.drawings d
  WHERE 
    d.published_at IS NOT NULL AND
    d.published_at::DATE = target_date
  ORDER BY d.score DESC, d.published_at ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and store weekly winners (Monday to Sunday)
CREATE OR REPLACE FUNCTION calculate_weekly_winners(end_date DATE DEFAULT date_trunc('week', CURRENT_DATE - INTERVAL '1 day')::DATE + INTERVAL '6 days')
RETURNS void AS $$
DECLARE
  start_date DATE := date_trunc('week', end_date)::DATE;
BEGIN
  -- Delete any existing winners for this week to avoid duplicates
  DELETE FROM public.winners 
  WHERE category = 'weekly' AND start_date = start_date AND end_date = end_date;
  
  -- Insert the new weekly winner
  INSERT INTO public.winners (drawing_id, category, start_date, end_date, score)
  SELECT 
    d.id,
    'weekly',
    start_date,
    end_date,
    d.score
  FROM public.drawings d
  WHERE 
    d.published_at IS NOT NULL AND
    d.published_at::DATE BETWEEN start_date AND end_date
  ORDER BY d.score DESC, d.published_at ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql; 