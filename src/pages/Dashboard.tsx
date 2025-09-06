import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent, PersianCardDescription, PersianCardHeader, PersianCardTitle } from "@/components/ui/persian-card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Brain, 
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  Globe,
  Zap,
  Database,
  Workflow
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    activeUsers: 0,
    todayViews: 0,
    monthlyRevenue: 0
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch articles count
      const { count: articlesCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      // Fetch profiles count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch recent articles
      const { data: articles } = await supabase
        .from('articles')
        .select(`
          *,
          categories(name, icon),
          profiles(display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(4);

      // Calculate total views from articles
      const { data: viewsData } = await supabase
        .from('articles')
        .select('views');

      const totalViews = viewsData?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

      setStats({
        totalArticles: articlesCount || 0,
        activeUsers: usersCount || 0,
        todayViews: Math.floor(totalViews * 0.1), // Simulate today's views as 10% of total
        monthlyRevenue: Math.floor(totalViews * 0.05) // Simulate revenue
      });

      setRecentArticles(articles || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Dynamic stats from database
  const dashboardStats = [
    { icon: FileText, label: "کل مقالات", value: stats.totalArticles.toLocaleString(), change: "+12%" },
    { icon: Users, label: "کاربران فعال", value: stats.activeUsers.toLocaleString(), change: "+8%" },
    { icon: Eye, label: "بازدید امروز", value: stats.todayViews.toLocaleString(), change: "+25%" },
    { icon: TrendingUp, label: "درآمد ماه", value: `₹${stats.monthlyRevenue.toLocaleString()}`, change: "+18%" }
  ];

  const quickActions = [
    { icon: Plus, title: "مقاله جدید", description: "ایجاد مقاله جدید", color: "bg-primary" },
    { icon: Brain, title: "تولید AI", description: "تولید محتوا با هوش مصنوعی", color: "bg-accent" },
    { icon: Users, title: "مدیریت کاربران", description: "مشاهده و مدیریت کاربران", color: "bg-success" },
    { icon: Settings, title: "تنظیمات", description: "تنظیمات سیستم و پیکربندی", color: "bg-warning" }
  ];

  return (
    <PersianLayout variant="dashboard">
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-card border-b shadow-soft">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">پنل مدیریت نیگار دیپ</h1>
                  <p className="text-muted-foreground">خوش آمدید، {user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <PersianButton variant="outline" size="sm" asChild>
                  <Link to="/articles">
                    <Globe className="ml-2 h-4 w-4" />
                    مشاهده سایت
                  </Link>
                </PersianButton>
                
                <PersianButton variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="ml-2 h-4 w-4" />
                  خروج
                </PersianButton>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <PersianCard key={index} variant="elegant" className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PersianCardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-success text-sm font-medium">{stat.change}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </PersianCardContent>
                </PersianCard>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">اقدامات سریع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <PersianCard key={index} variant="default" className="cursor-pointer hover:scale-105 transition-all group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PersianCardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">{action.title}</h3>
                    <p className="text-muted-foreground text-sm">{action.description}</p>
                  </PersianCardContent>
                </PersianCard>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Articles */}
            <section>
              <PersianCard variant="elegant">
                <PersianCardHeader>
                  <PersianCardTitle className="flex items-center justify-between">
                    <span>مقالات اخیر</span>
                    <PersianButton variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </PersianButton>
                  </PersianCardTitle>
                  <PersianCardDescription>
                    آخرین مقالات ایجاد شده در سیستم
                  </PersianCardDescription>
                </PersianCardHeader>
                
                <PersianCardContent>
                  <div className="space-y-4">
                    {recentArticles.map((article, index) => (
                      <div key={article.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{article.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className={`px-2 py-1 rounded-lg ${
                              article.status === 'published' ? 'bg-success/20 text-success' :
                              article.status === 'draft' ? 'bg-warning/20 text-warning' :
                              'bg-primary/20 text-primary'
                            }`}>
                              {article.status === 'published' ? 'منتشر شده' : 
                               article.status === 'draft' ? 'پیش‌نویس' : 'در حال بررسی'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(article.created_at).toLocaleDateString('fa-IR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <PersianButton variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </PersianButton>
                          <PersianButton variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </PersianButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </PersianCardContent>
              </PersianCard>
            </section>

            {/* System Status */}
            <section>
              <PersianCard variant="elegant">
                <PersianCardHeader>
                  <PersianCardTitle>وضعیت سیستم</PersianCardTitle>
                  <PersianCardDescription>
                    نمای کلی از عملکرد سیستم
                  </PersianCardDescription>
                </PersianCardHeader>
                
                <PersianCardContent>
                  <div className="space-y-6">
                    {/* Database Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                          <Database className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">دیتابیس</p>
                          <p className="text-sm text-muted-foreground">متصل و فعال</p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    </div>

                    {/* AI Service */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">سرویس هوش مصنوعی</p>
                          <p className="text-sm text-muted-foreground">آماده برای استفاده</p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    </div>

                    {/* N8N Integration */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center">
                          <Workflow className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">اتوماسیون n8n</p>
                          <p className="text-sm text-muted-foreground">نیاز به پیکربندی</p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
                    </div>

                    {/* Quick Setup */}
                    <div className="pt-4 border-t">
                      <PersianButton variant="gradient" className="w-full">
                        <Zap className="ml-2 h-4 w-4" />
                        راه‌اندازی سریع Supabase
                      </PersianButton>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        برای فعال‌سازی کامل امکانات، روی دکمه سبز Supabase کلیک کنید
                      </p>
                    </div>
                  </div>
                </PersianCardContent>
              </PersianCard>
            </section>
          </div>
        </div>
      </div>
    </PersianLayout>
  );
};

export default Dashboard;