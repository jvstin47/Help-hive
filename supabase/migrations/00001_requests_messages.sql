CREATE TYPE public.request_category AS ENUM ('grocery', 'medication', 'companionship', 'other');
CREATE TYPE public.request_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE public.request_status AS ENUM ('draft', 'submitted', 'pending', 'assigned', 'traveling', 'arrived', 'in_progress', 'completed', 'cancelled');

CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category request_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority request_priority DEFAULT 'normal' NOT NULL,
  status request_status DEFAULT 'submitted' NOT NULL,
  preferred_time TIMESTAMPTZ,
  address TEXT NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS for Requests
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Requesters can view their own requests"
  ON public.requests FOR SELECT
  USING (auth.uid() = requester_id);

CREATE POLICY "Volunteers can view active requests"
  ON public.requests FOR SELECT
  USING (status IN ('submitted', 'pending', 'assigned', 'traveling', 'arrived', 'in_progress', 'completed', 'cancelled'));

CREATE POLICY "Requesters can insert their own requests"
  ON public.requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update relevant requests"
  ON public.requests FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = volunteer_id);

-- RLS for Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their requests"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.requests
      WHERE requests.id = messages.request_id
      AND (requests.requester_id = auth.uid() OR requests.volunteer_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their requests"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.requests
      WHERE requests.id = messages.request_id
      AND (requests.requester_id = auth.uid() OR requests.volunteer_id = auth.uid())
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_requests_modtime
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
