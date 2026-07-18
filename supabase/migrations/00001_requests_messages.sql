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

CREATE POLICY "Requesters can update their own requests"
  ON public.requests FOR UPDATE
  USING (auth.uid() = requester_id);

CREATE POLICY "Volunteers can update assigned requests"
  ON public.requests FOR UPDATE
  USING (auth.uid() = volunteer_id OR (status = 'pending'::request_status AND volunteer_id IS NULL));

CREATE OR REPLACE FUNCTION restrict_request_updates()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() = OLD.requester_id THEN
    IF NEW.volunteer_id IS DISTINCT FROM OLD.volunteer_id THEN
      RAISE EXCEPTION 'Requester cannot update volunteer_id';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status != 'cancelled'::request_status THEN
      RAISE EXCEPTION 'Requester can only update status to cancelled';
    END IF;
  ELSIF auth.uid() = OLD.volunteer_id OR (OLD.volunteer_id IS NULL AND NEW.volunteer_id = auth.uid()) THEN
    IF NEW.title IS DISTINCT FROM OLD.title OR
       NEW.description IS DISTINCT FROM OLD.description OR
       NEW.category IS DISTINCT FROM OLD.category OR
       NEW.priority IS DISTINCT FROM OLD.priority OR
       NEW.address IS DISTINCT FROM OLD.address THEN
      RAISE EXCEPTION 'Volunteer cannot update request details';
    END IF;
    IF NEW.volunteer_id IS DISTINCT FROM OLD.volunteer_id THEN
      IF OLD.status != 'pending'::request_status OR NEW.volunteer_id != auth.uid() THEN
        RAISE EXCEPTION 'Volunteer can only assign themselves when status is pending';
      END IF;
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status NOT IN ('assigned'::request_status, 'in_progress'::request_status, 'completed'::request_status) THEN
      RAISE EXCEPTION 'Volunteer can only update status to assigned, in_progress, or completed';
    END IF;
  ELSE
    RAISE EXCEPTION 'Not authorized to update request';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_request_update_cols
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE PROCEDURE restrict_request_updates();

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

-- Profile full access policy dependent on requests
CREATE POLICY "Full profile access for owners and assigned volunteers"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.requests
      WHERE (requests.requester_id = profiles.id AND requests.volunteer_id = auth.uid())
         OR (requests.volunteer_id = profiles.id AND requests.requester_id = auth.uid())
    )
  );

-- View for masking address from browsing volunteers
CREATE OR REPLACE VIEW public.requests_browse AS
SELECT 
  id,
  requester_id,
  volunteer_id,
  category,
  title,
  description,
  priority,
  status,
  preferred_time,
  CASE 
    WHEN auth.uid() = requester_id OR auth.uid() = volunteer_id THEN address 
    ELSE NULL 
  END as address,
  special_instructions,
  created_at,
  updated_at
FROM public.requests;
