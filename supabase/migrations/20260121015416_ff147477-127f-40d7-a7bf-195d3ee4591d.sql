-- Fix the permissive usage_logs INSERT policy
DROP POLICY IF EXISTS "System can insert usage logs" ON public.usage_logs;

-- Only allow inserts for authenticated users to their dealership
CREATE POLICY "Users can insert usage logs for their dealership" ON public.usage_logs
    FOR INSERT WITH CHECK (dealership_id = public.get_user_dealership_id(auth.uid()));

-- Super admins can insert for any dealership
CREATE POLICY "Super admins can insert any usage logs" ON public.usage_logs
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));