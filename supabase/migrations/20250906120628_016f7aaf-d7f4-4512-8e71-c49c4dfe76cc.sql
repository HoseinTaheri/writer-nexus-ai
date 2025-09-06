-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES public.categories(id),
  author_id UUID REFERENCES public.profiles(user_id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[],
  reading_time INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create webhooks table for n8n integration
CREATE TABLE public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories" ON public.categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for articles
CREATE POLICY "Anyone can view published articles" ON public.articles FOR SELECT USING (
  status = 'published' OR 
  author_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Authors and editors can create articles" ON public.articles FOR INSERT WITH CHECK (
  auth.uid() = author_id OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Authors and admins can update articles" ON public.articles FOR UPDATE USING (
  author_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can delete articles" ON public.articles FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for comments
CREATE POLICY "Anyone can view approved comments" ON public.comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can create comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all comments" ON public.comments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for settings (admin only)
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for webhooks (admin only)
CREATE POLICY "Admins can manage webhooks" ON public.webhooks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO public.categories (name, slug, description, color, icon) VALUES
('امنیت', 'security', 'مقالات مربوط به امنیت شبکه و سایبری', '#ef4444', '🛡️'),
('گیمینگ', 'gaming', 'مقالات مربوط به بازی و گیمینگ', '#8b5cf6', '🎮'),
('DNS', 'dns', 'مقالات مربوط به DNS و شبکه', '#06b6d4', '🌐'),
('IPv6', 'ipv6', 'مقالات مربوط به IPv6 و پروتکل‌های شبکه', '#10b981', '🚀'),
('عمومی', 'general', 'مقالات عمومی و متفرقه', '#6366f1', '📄');

-- Insert sample articles
INSERT INTO public.articles (title, slug, content, excerpt, category_id, status, tags, reading_time, views, likes, comments_count, published_at) 
SELECT 
  '۱۰ راهکار مؤثر برای کاهش پینگ در بازی‌های آنلاین',
  '10-ways-to-reduce-ping-online-games',
  'راهکارهای عملی و تست شده برای کاهش پینگ و بهبود تجربه گیمینگ آنلاین شما. در این مقاله به بررسی روش‌های مختلف کاهش تأخیر در بازی‌های آنلاین می‌پردازیم.',
  'راهکارهای عملی و تست شده برای کاهش پینگ و بهبود تجربه گیمینگ آنلاین شما',
  c.id,
  'published',
  ARRAY['گیمینگ', 'شبکه', 'پینگ'],
  5,
  1234,
  89,
  18,
  now() - interval '2 days'
FROM public.categories c WHERE c.slug = 'gaming'

UNION ALL

SELECT 
  'چرا باید از DNS امن استفاده کنیم؟ راهنمای کامل',
  'secure-dns-complete-guide',
  'بررسی کامل مزایای DNS امن و نحوه پیکربندی آن برای حفاظت از حریم خصوصی. DNS امن یکی از مهم‌ترین ابزارهای حفاظت از امنیت کاربران است.',
  'بررسی کامل مزایای DNS امن و نحوه پیکربندی آن برای حفاظت از حریم خصوصی',
  c.id,
  'published',
  ARRAY['امنیت', 'DNS', 'حریم خصوصی'],
  7,
  2105,
  156,
  32,
  now() - interval '5 days'
FROM public.categories c WHERE c.slug = 'security'

UNION ALL

SELECT 
  'آموزش کامل IPv6: آینده اینترنت',
  'ipv6-complete-tutorial-future-internet',
  'راهنمای جامع IPv6، مزایا، نحوه پیکربندی و آمادگی برای آینده اینترنت. IPv6 نسل جدید پروتکل اینترنت است که جایگزین IPv4 خواهد شد.',
  'راهنمای جامع IPv6، مزایا، نحوه پیکربندی و آمادگی برای آینده اینترنت',
  c.id,
  'published',
  ARRAY['IPv6', 'شبکه', 'اینترنت'],
  10,
  1876,
  134,
  24,
  now() - interval '1 week'
FROM public.categories c WHERE c.slug = 'ipv6';

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
('site_title', '"نیگار دیپ - مقالات تخصصی"'),
('site_description', '"جدیدترین مقالات و تحلیل‌های عمیق در حوزه امنیت شبکه، DNS، IPv6 و پیشرفته‌ترین فناوری‌های گیمینگ"'),
('articles_per_page', '12'),
('allow_comments', 'true'),
('auto_approve_comments', 'false');