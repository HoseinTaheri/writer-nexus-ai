import { Link } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent, PersianCardDescription, PersianCardHeader, PersianCardTitle } from "@/components/ui/persian-card";
import { 
  Brain, 
  FileText, 
  Users, 
  Zap, 
  BarChart3, 
  Settings, 
  Globe, 
  ArrowLeft,
  Sparkles,
  BookOpen,
  Database,
  Workflow
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "تولید محتوا با هوش مصنوعی",
      description: "تولید مقالات با کیفیت بالا با استفاده از مدل‌های مختلف AI"
    },
    {
      icon: FileText,
      title: "مدیریت مقالات پیشرفته",
      description: "ویرایش، دسته‌بندی و انتشار مقالات با ابزارهای حرفه‌ای"
    },
    {
      icon: Users,
      title: "مدیریت کاربران",
      description: "سیستم کامل مدیریت کاربران با نقش‌های مختلف"
    },
    {
      icon: Workflow,
      title: "اتوماسیون با n8n",
      description: "انتشار خودکار مقالات و جریان‌های کاری هوشمند"
    },
    {
      icon: BarChart3,
      title: "آمار و تحلیل",
      description: "داشبورد جامع برای نظارت بر عملکرد و آمار سایت"
    },
    {
      icon: Database,
      title: "ذخیره‌سازی ابری",
      description: "ذخیره امن در Supabase با پشتیبان‌گیری خودکار"
    }
  ];

  return (
    <PersianLayout variant="hero">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-20 animate-fade-in-up">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              سیستم مدیریت محتوا
              <span className="block text-transparent bg-gradient-to-r from-white to-primary-glow bg-clip-text">
                نیگار دیپ
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              پلتفرم پیشرفته مدیریت محتوا با قابلیت تولید هوشمند مقالات، 
              اتوماسیون کامل و مدیریت حرفه‌ای کاربران
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <PersianButton variant="hero" size="xl" asChild>
                <Link to="/login" className="group">
                  <Settings className="ml-2 group-hover:rotate-90 transition-transform" />
                  ورود به پنل مدیریت
                </Link>
              </PersianButton>
              
              <PersianButton variant="glass" size="xl" asChild>
                <Link to="/articles" className="group">
                  <BookOpen className="ml-2 group-hover:scale-110 transition-transform" />
                  مشاهده مقالات
                </Link>
              </PersianButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="glass-effect rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">1000+</div>
                <div className="text-white/80">مقالات منتشر شده</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-white/80">کاربران فعال</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80">پشتیبانی آنلاین</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              امکانات پیشرفته سیستم
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              ابزارهای حرفه‌ای برای مدیریت هوشمند محتوا و اتوماسیون کامل
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <PersianCard key={index} variant="glass" className="group animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <PersianCardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-primary-glow" />
                  </div>
                  <PersianCardTitle className="text-white group-hover:text-primary-glow transition-colors">
                    {feature.title}
                  </PersianCardTitle>
                </PersianCardHeader>
                <PersianCardContent>
                  <PersianCardDescription className="text-white/80 text-center leading-relaxed">
                    {feature.description}
                  </PersianCardDescription>
                </PersianCardContent>
              </PersianCard>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <PersianCard variant="glass" className="max-w-4xl mx-auto">
            <PersianCardContent className="p-12">
              <Sparkles className="h-16 w-16 text-primary-glow mx-auto mb-6 animate-gentle-bounce" />
              <h2 className="text-4xl font-bold text-white mb-6">
                آماده شروع هستید؟
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                با سیستم مدیریت محتوا نیگار دیپ، تجربه جدیدی از مدیریت هوشمند محتوا را آغاز کنید
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PersianButton variant="hero" size="xl" asChild>
                  <Link to="/login">
                    <ArrowLeft className="ml-2" />
                    شروع کار با پنل
                  </Link>
                </PersianButton>
                
                <PersianButton variant="outline" size="xl" className="border-white/30 text-white hover:bg-white hover:text-primary">
                  <Globe className="ml-2" />
                  مشاهده نمونه‌ها
                </PersianButton>
              </div>
            </PersianCardContent>
          </PersianCard>
        </section>
      </div>
    </PersianLayout>
  );
};

export default Home;