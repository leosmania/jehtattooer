-- Add reference images column to quotation_requests
-- Stores array of Supabase Storage public URLs
ALTER TABLE quotation_requests
  ADD COLUMN IF NOT EXISTS imagens_referencia TEXT[] DEFAULT '{}';
