
-- water_analyses: prevent exact duplicate submissions
ALTER TABLE public.water_analyses
ADD CONSTRAINT unique_water_analysis_cdc_dates UNIQUE (cdc_dv, previous_reading_date, current_reading_date);

-- Add length constraints for petition_signatures
ALTER TABLE public.petition_signatures
ADD CONSTRAINT check_nome_length CHECK (length(nome) <= 200),
ADD CONSTRAINT check_documento_length CHECK (length(documento) <= 50),
ADD CONSTRAINT check_email_length CHECK (length(email) <= 255),
ADD CONSTRAINT check_cdc_matricula_length CHECK (length(cdc_matricula) <= 50),
ADD CONSTRAINT check_media_consumo_length CHECK (length(media_consumo) <= 100),
ADD CONSTRAINT check_consumo_valor_atual_length CHECK (length(consumo_valor_atual) <= 100);

-- Add length constraints for water_analyses
ALTER TABLE public.water_analyses
ADD CONSTRAINT check_user_name_length CHECK (length(user_name) <= 200),
ADD CONSTRAINT check_cdc_dv_length CHECK (length(cdc_dv) <= 50);
