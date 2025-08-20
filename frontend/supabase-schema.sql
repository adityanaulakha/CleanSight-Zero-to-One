-- CleanSight Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'ragpicker', 'institution', 'admin')),
  city TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  
  -- Role-specific fields
  organization TEXT, -- for institutions
  specialization TEXT[], -- for ragpickers
  experience TEXT CHECK (experience IN ('beginner', 'intermediate', 'experienced')), -- for ragpickers
  zone_id TEXT, -- assigned zone for ragpickers
  
  -- Stats
  total_points INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  total_reports INTEGER DEFAULT 0,
  total_tasks_completed INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zones table
CREATE TABLE public.zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bounds JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('plastic', 'organic', 'metal', 'glass', 'e-waste', 'hazardous', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  address TEXT,
  image_url TEXT,
  cleanup_image_url TEXT,
  reported_by UUID REFERENCES public.users(id) NOT NULL,
  assigned_to UUID REFERENCES public.users(id),
  zone_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'verified')),
  assigned_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (for ragpickers)
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) NOT NULL,
  assigned_to UUID REFERENCES public.users(id) NOT NULL,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
  cleanup_image_url TEXT,
  weight_collected DECIMAL,
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards table
CREATE TABLE public.rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  report_id UUID REFERENCES public.reports(id),
  points INTEGER DEFAULT 0,
  earnings INTEGER DEFAULT 0,
  weight DECIMAL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('report_completion', 'cleanup_completion', 'bonus', 'penalty')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_report', 'task_assigned', 'task_completed', 'reward_earned', 'system')),
  report_id UUID REFERENCES public.reports(id),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can see their own profile and public info of others
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Reports policies
CREATE POLICY "Anyone can view reports" ON public.reports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Citizens can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Report owners and assigned ragpickers can update" ON public.reports
  FOR UPDATE USING (auth.uid() = reported_by OR auth.uid() = assigned_to);

-- Tasks policies
CREATE POLICY "Assigned ragpickers can view their tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = assigned_to);

CREATE POLICY "Assigned ragpickers can update their tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = assigned_to);

-- Rewards policies
CREATE POLICY "Users can view their own rewards" ON public.rewards
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('report-images', 'report-images', true),
  ('profile-images', 'profile-images', true),
  ('cleanup-images', 'cleanup-images', true);

-- Storage policies
CREATE POLICY "Anyone can view report images" ON storage.objects
  FOR SELECT USING (bucket_id = 'report-images');

CREATE POLICY "Authenticated users can upload report images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'report-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view cleanup images" ON storage.objects
  FOR SELECT USING (bucket_id = 'cleanup-images');

CREATE POLICY "Ragpickers can upload cleanup images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cleanup-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

-- Insert default zones
INSERT INTO public.zones (id, name, bounds) VALUES
  ('zone-1', 'Sector 14-15 (Gurugram)', '{"north": 28.4595, "south": 28.4495, "east": 77.0466, "west": 77.0366}'),
  ('zone-2', 'Cyber Hub Area', '{"north": 28.4950, "south": 28.4850, "east": 77.0900, "west": 77.0800}'),
  ('zone-3', 'Golf Course Road', '{"north": 28.4700, "south": 28.4600, "east": 77.0700, "west": 77.0600}'),
  ('zone-4', 'Sohna Road', '{"north": 28.4300, "south": 28.4200, "east": 77.0500, "west": 77.0400}');

-- Create functions for updating user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user stats when rewards are added
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users 
    SET 
      total_points = total_points + NEW.points,
      total_earnings = total_earnings + NEW.earnings
    WHERE id = NEW.user_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating user stats
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Create function for automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role, city, address, phone, organization, specialization, experience, zone_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen'),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.raw_user_meta_data->>'organization',
    CASE WHEN NEW.raw_user_meta_data->>'specialization' IS NOT NULL 
         THEN string_to_array(NEW.raw_user_meta_data->>'specialization', ',')
         ELSE NULL END,
    NEW.raw_user_meta_data->>'experience',
    CASE WHEN NEW.raw_user_meta_data->>'role' = 'ragpicker' 
         THEN 'zone-1'  -- Default zone, can be updated later
         ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
