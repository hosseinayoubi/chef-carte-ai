-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fridge lists table
CREATE TABLE public.fridge_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Fridge',
  items TEXT[] NOT NULL DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.fridge_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fridge lists" ON public.fridge_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fridge lists" ON public.fridge_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fridge lists" ON public.fridge_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fridge lists" ON public.fridge_lists
  FOR DELETE USING (auth.uid() = user_id);

-- Recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fridge_list_id UUID REFERENCES public.fridge_lists(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  cuisine TEXT,
  time_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  has_ingredients TEXT[] DEFAULT '{}',
  missing_ingredients TEXT[] DEFAULT '{}',
  substitutions JSONB DEFAULT '[]',
  steps TEXT[] DEFAULT '{}',
  tips TEXT[] DEFAULT '{}',
  nutrition JSONB DEFAULT '{}',
  saved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recipes" ON public.recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" ON public.recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON public.recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON public.recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics events table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own analytics" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Index for faster queries
CREATE INDEX idx_fridge_lists_user_id ON public.fridge_lists(user_id);
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_recipes_saved ON public.recipes(saved) WHERE saved = true;
CREATE INDEX idx_analytics_event_name ON public.analytics_events(event_name);