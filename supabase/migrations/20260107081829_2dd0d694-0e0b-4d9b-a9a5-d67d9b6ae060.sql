-- Add film_type column to films table (QFLIX original vs external)
ALTER TABLE public.films 
ADD COLUMN IF NOT EXISTS film_type text NOT NULL DEFAULT 'external' CHECK (film_type IN ('qflix_original', 'external'));

-- Create distributor applications table
CREATE TABLE public.distributor_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  film_id uuid NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  social_media_links text[] NOT NULL DEFAULT '{}',
  audience_size text,
  promotion_strategy text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create distribution tokens table (issued upon approval)
CREATE TABLE public.distribution_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  film_id uuid NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES public.distributor_applications(id) ON DELETE CASCADE,
  tracking_code text NOT NULL UNIQUE DEFAULT substring(md5(random()::text) from 1 for 12),
  is_active boolean NOT NULL DEFAULT true,
  total_sales integer NOT NULL DEFAULT 0,
  total_revenue numeric NOT NULL DEFAULT 0,
  total_earnings numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  revoked_at timestamp with time zone
);

-- Add distributor tracking to purchases
ALTER TABLE public.purchases 
ADD COLUMN IF NOT EXISTS distributor_token_id uuid REFERENCES public.distribution_tokens(id),
ADD COLUMN IF NOT EXISTS distributor_earnings numeric DEFAULT 0;

-- Enable RLS
ALTER TABLE public.distributor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for distributor_applications
CREATE POLICY "Users can view own applications" 
ON public.distributor_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" 
ON public.distributor_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Film creators can view applications for their films" 
ON public.distributor_applications 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.films WHERE id = film_id AND creator_id = auth.uid()));

-- RLS policies for distribution_tokens
CREATE POLICY "Users can view own tokens" 
ON public.distribution_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view token by tracking code for purchases" 
ON public.distribution_tokens 
FOR SELECT 
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_distributor_applications_updated_at
BEFORE UPDATE ON public.distributor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create index for tracking code lookups
CREATE INDEX idx_distribution_tokens_tracking_code ON public.distribution_tokens(tracking_code);
CREATE INDEX idx_distributor_applications_film_id ON public.distributor_applications(film_id);
CREATE INDEX idx_distributor_applications_user_id ON public.distributor_applications(user_id);