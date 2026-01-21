-- Add V-Suite org key to dealerships table for per-dealership API key storage
ALTER TABLE public.dealerships 
ADD COLUMN vsuite_org_key text;