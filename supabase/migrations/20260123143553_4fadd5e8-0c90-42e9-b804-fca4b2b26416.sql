-- =====================================================
-- FIX: PUBLIC DATA EXPOSURE IN petition_signatures
-- =====================================================

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can count signatures" ON public.petition_signatures;

-- Create a new policy that ONLY allows counting rows (no data access)
-- This uses a security definer function to provide count only
CREATE OR REPLACE FUNCTION public.get_petition_signature_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*) FROM public.petition_signatures;
$$;

-- Create a restrictive SELECT policy that denies all direct reads
-- Users must use the get_petition_signature_count() function instead
CREATE POLICY "No direct read access to signatures"
ON public.petition_signatures
FOR SELECT
USING (false);

-- =====================================================
-- FIX: PUBLIC DATA EXPOSURE IN water_analyses
-- =====================================================

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view analyses by CDC" ON public.water_analyses;

-- Create a security definer function to search by CDC (returns limited data)
-- This prevents exposure of all records while allowing users to find their own
CREATE OR REPLACE FUNCTION public.get_analyses_by_cdc(search_cdc text)
RETURNS TABLE (
  id uuid,
  created_at timestamp with time zone,
  user_name text,
  cdc_dv text,
  consumption numeric,
  normalized_consumption numeric,
  charged_value numeric,
  total_technical_value numeric,
  difference_absolute numeric,
  difference_percent numeric,
  diagnosis_items jsonb,
  tariff_breakdown jsonb,
  historical_entries jsonb,
  previous_reading_date date,
  current_reading_date date,
  previous_reading numeric,
  current_reading numeric,
  fixed_fee numeric,
  include_sewer boolean,
  cycle_days integer,
  daily_consumption numeric,
  water_value numeric,
  sewer_value numeric,
  historical_average numeric,
  volume_anomaly numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id, created_at, user_name, cdc_dv, consumption, normalized_consumption,
    charged_value, total_technical_value, difference_absolute, difference_percent,
    diagnosis_items, tariff_breakdown, historical_entries, previous_reading_date,
    current_reading_date, previous_reading, current_reading, fixed_fee, include_sewer,
    cycle_days, daily_consumption, water_value, sewer_value, historical_average, volume_anomaly
  FROM public.water_analyses
  WHERE cdc_dv = search_cdc
  ORDER BY created_at DESC;
$$;

-- Create a restrictive SELECT policy that denies all direct reads
-- Users must use the get_analyses_by_cdc() function instead
CREATE POLICY "No direct read access to analyses"
ON public.water_analyses
FOR SELECT
USING (false);