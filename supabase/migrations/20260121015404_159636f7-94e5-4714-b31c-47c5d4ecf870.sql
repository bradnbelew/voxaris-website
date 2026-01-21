-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'user');

-- Create enum for agent types
CREATE TYPE public.agent_type AS ENUM ('voice', 'video');

-- Create enum for agent status
CREATE TYPE public.agent_status AS ENUM ('active', 'paused', 'draft');

-- Create dealerships (tenants) table
CREATE TABLE public.dealerships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    website_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE SET NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);

-- Create agents table
CREATE TABLE public.agents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    dealership_id UUID NOT NULL REFERENCES public.dealerships(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    type agent_type NOT NULL,
    status agent_status NOT NULL DEFAULT 'draft',
    avatar_url TEXT,
    system_prompt TEXT,
    webhook_url TEXT,
    voice_id TEXT,
    persona_id TEXT,
    knowledge_base JSONB DEFAULT '[]'::jsonb,
    objection_handling JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent templates table (the "Hiring Hall")
CREATE TABLE public.agent_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    type agent_type NOT NULL,
    avatar_url TEXT,
    description TEXT,
    default_prompt TEXT,
    voice_id TEXT,
    persona_id TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage_logs table
CREATE TABLE public.usage_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    dealership_id UUID NOT NULL REFERENCES public.dealerships(id) ON DELETE CASCADE,
    calls_made INTEGER NOT NULL DEFAULT 0,
    minutes_used DECIMAL(10,2) NOT NULL DEFAULT 0,
    appointments_booked INTEGER NOT NULL DEFAULT 0,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (agent_id, log_date)
);

-- Enable RLS on all tables
ALTER TABLE public.dealerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to get user's dealership_id
CREATE OR REPLACE FUNCTION public.get_user_dealership_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT dealership_id
    FROM public.profiles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- RLS Policies for dealerships
CREATE POLICY "Super admins can view all dealerships" ON public.dealerships
    FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their own dealership" ON public.dealerships
    FOR SELECT USING (id = public.get_user_dealership_id(auth.uid()));

CREATE POLICY "Super admins can manage all dealerships" ON public.dealerships
    FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can update their dealership" ON public.dealerships
    FOR UPDATE USING (
        id = public.get_user_dealership_id(auth.uid()) 
        AND public.has_role(auth.uid(), 'admin')
    );

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view dealership profiles" ON public.profiles
    FOR SELECT USING (
        dealership_id = public.get_user_dealership_id(auth.uid())
        AND public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for agents
CREATE POLICY "Users can view dealership agents" ON public.agents
    FOR SELECT USING (dealership_id = public.get_user_dealership_id(auth.uid()));

CREATE POLICY "Super admins can view all agents" ON public.agents
    FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage dealership agents" ON public.agents
    FOR ALL USING (
        dealership_id = public.get_user_dealership_id(auth.uid())
        AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'user'))
    );

CREATE POLICY "Super admins can manage all agents" ON public.agents
    FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for agent_templates (public read, super_admin write)
CREATE POLICY "Anyone can view active templates" ON public.agent_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Super admins can manage templates" ON public.agent_templates
    FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for usage_logs
CREATE POLICY "Users can view dealership usage" ON public.usage_logs
    FOR SELECT USING (dealership_id = public.get_user_dealership_id(auth.uid()));

CREATE POLICY "Super admins can view all usage" ON public.usage_logs
    FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "System can insert usage logs" ON public.usage_logs
    FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_dealerships_updated_at
    BEFORE UPDATE ON public.dealerships
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
    
    -- Default role is 'user'
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();