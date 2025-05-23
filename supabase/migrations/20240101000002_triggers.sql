-- Triggers for automatic winner calculations

-- Create a function that will be called by the daily trigger
CREATE OR REPLACE FUNCTION trigger_calculate_daily_winners()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate winners for yesterday
  PERFORM calculate_daily_winners(CURRENT_DATE - INTERVAL '1 day');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function that will be called by the weekly trigger
CREATE OR REPLACE FUNCTION trigger_calculate_weekly_winners()
RETURNS TRIGGER AS $$
BEGIN
  -- If today is Monday (day 1), calculate winners for the previous week
  IF EXTRACT(DOW FROM CURRENT_DATE) = 1 THEN
    PERFORM calculate_weekly_winners(CURRENT_DATE - INTERVAL '1 day');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a daily trigger that runs at midnight
CREATE TRIGGER daily_winners_trigger
  AFTER INSERT ON public.drawings
  EXECUTE FUNCTION trigger_calculate_daily_winners();

-- Create a weekly trigger that runs on Mondays
CREATE TRIGGER weekly_winners_trigger
  AFTER INSERT ON public.drawings
  EXECUTE FUNCTION trigger_calculate_weekly_winners(); 