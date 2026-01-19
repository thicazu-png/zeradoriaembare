-- Create table for petition signatures
CREATE TABLE public.petition_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  documento TEXT NOT NULL,
  email TEXT NOT NULL,
  cdc_matricula TEXT NOT NULL,
  media_consumo TEXT NOT NULL,
  consumo_valor_atual TEXT NOT NULL,
  foto_conta_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.petition_signatures ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public petition)
CREATE POLICY "Anyone can sign petition" 
ON public.petition_signatures 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to count signatures (for the counter)
CREATE POLICY "Anyone can count signatures" 
ON public.petition_signatures 
FOR SELECT 
USING (true);

-- Create storage bucket for petition photos
INSERT INTO storage.buckets (id, name, public) VALUES ('petition-photos', 'petition-photos', true);

-- Storage policies for petition photos
CREATE POLICY "Anyone can upload petition photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'petition-photos');

CREATE POLICY "Anyone can view petition photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'petition-photos');