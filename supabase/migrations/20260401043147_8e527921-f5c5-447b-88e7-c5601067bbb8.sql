
CREATE TABLE public.websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  amenities JSONB DEFAULT '[]'::jsonb,
  room_types JSONB DEFAULT '[]'::jsonb,
  landmarks JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own websites"
  ON public.websites FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own websites"
  ON public.websites FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own websites"
  ON public.websites FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own websites"
  ON public.websites FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
