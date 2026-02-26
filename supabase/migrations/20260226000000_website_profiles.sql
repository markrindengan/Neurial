
-- Create website_profiles table for user dashboard data
CREATE TABLE public.website_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  website_url TEXT,
  goal TEXT,
  monthly_income NUMERIC,
  client_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own data
CREATE POLICY "Users can view own website profile"
  ON public.website_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own website profile"
  ON public.website_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own website profile"
  ON public.website_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create update_updated_at function if it doesn't already exist
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Auto-update updated_at timestamp
CREATE TRIGGER update_website_profiles_updated_at
  BEFORE UPDATE ON public.website_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Update handle_new_user trigger to also create website_profiles entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO public.website_profiles (user_id, website_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'website_url');

  RETURN NEW;
END;
$$;
