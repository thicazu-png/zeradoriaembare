-- Create table for water bill analyses
CREATE TABLE public.water_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- User data
  user_name TEXT NOT NULL,
  cdc_dv TEXT NOT NULL,
  
  -- Reading data
  previous_reading_date DATE NOT NULL,
  current_reading_date DATE NOT NULL,
  previous_reading NUMERIC NOT NULL,
  current_reading NUMERIC NOT NULL,
  charged_value NUMERIC NOT NULL,
  fixed_fee NUMERIC NOT NULL,
  include_sewer BOOLEAN NOT NULL DEFAULT true,
  
  -- Calculated cycle data
  cycle_days INTEGER NOT NULL,
  consumption NUMERIC NOT NULL,
  daily_consumption NUMERIC NOT NULL,
  normalized_consumption NUMERIC NOT NULL,
  
  -- Calculated bill data
  water_value NUMERIC NOT NULL,
  sewer_value NUMERIC NOT NULL,
  total_technical_value NUMERIC NOT NULL,
  
  -- Comparison data
  difference_absolute NUMERIC NOT NULL,
  difference_percent NUMERIC NOT NULL,
  
  -- Historical data
  historical_average NUMERIC,
  volume_anomaly NUMERIC,
  
  -- Diagnosis/Report
  diagnosis_items JSONB NOT NULL DEFAULT '[]',
  tariff_breakdown JSONB NOT NULL DEFAULT '[]',
  historical_entries JSONB NOT NULL DEFAULT '[]'
);

-- Enable Row Level Security
ALTER TABLE public.water_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert analyses
CREATE POLICY "Anyone can insert analyses" 
ON public.water_analyses 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to select by CDC
CREATE POLICY "Anyone can view analyses by CDC" 
ON public.water_analyses 
FOR SELECT 
USING (true);

-- Create index for faster CDC lookups
CREATE INDEX idx_water_analyses_cdc ON public.water_analyses (cdc_dv);
CREATE INDEX idx_water_analyses_created_at ON public.water_analyses (created_at DESC);