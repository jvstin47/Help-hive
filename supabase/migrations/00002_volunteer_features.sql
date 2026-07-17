CREATE TYPE public.availability_status AS ENUM ('available', 'busy', 'offline');

ALTER TABLE public.profiles 
  ADD COLUMN availability_status availability_status DEFAULT 'offline' NOT NULL,
  ADD COLUMN impact_score INTEGER DEFAULT 0 NOT NULL;
