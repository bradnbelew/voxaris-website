-- Create API keys table for organization API access
CREATE TABLE public.api_keys (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.dealerships(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    prefix TEXT NOT NULL,
    hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see/manage keys for their dealership
CREATE POLICY "Users can view their organization API keys"
ON public.api_keys
FOR SELECT
USING (organization_id = get_user_dealership_id(auth.uid()));

CREATE POLICY "Admins can create API keys for their organization"
ON public.api_keys
FOR INSERT
WITH CHECK (
    organization_id = get_user_dealership_id(auth.uid()) 
    AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'))
);

CREATE POLICY "Admins can delete API keys for their organization"
ON public.api_keys
FOR DELETE
USING (
    organization_id = get_user_dealership_id(auth.uid()) 
    AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'))
);

CREATE POLICY "Super admins can manage all API keys"
ON public.api_keys
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Index for faster lookups
CREATE INDEX idx_api_keys_organization ON public.api_keys(organization_id);
CREATE INDEX idx_api_keys_prefix ON public.api_keys(prefix);