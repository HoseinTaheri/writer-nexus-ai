import { useState, useEffect } from "react";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent } from "@/components/ui/persian-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  Heart, 
  MessageCircle,
  User,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [selectedFilter, setSelectedFilter] = useState("جدیدترین");
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedCategory, selectedFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories with article counts
      const { data: categoriesData } = await supabase
        .from('categories')
        .select(`
          *,
          articles!articles_category_id_fkey(count)
        `);

      if (categoriesData) {
        const formattedCategories = [
          { name: "همه", icon: "🌟", count: await getTotalArticlesCount() },
          ...categoriesData.map(cat => ({
            name: cat.name,
            icon: cat.icon,
            count: cat.articles?.length || 0,
            id: cat.id
          }))
        ];
        setCategories(formattedCategories);
      }

      // Build query for articles
      let query = supabase
        .from('articles')
        .select(`
          *,
          categories(name, icon, color),
          profiles(display_name)
        `, { count: 'exact' })
        .eq('status', 'published');

      // Apply category filter
      if (selectedCategory !== "همه") {
        const selectedCat = categoriesData?.find(cat => cat.name === selectedCategory);
        if (selectedCat) {
          query = query.eq('category_id', selectedCat.id);
        }
      }

      // Apply sorting
      switch (selectedFilter) {
        case "محبوب‌ترین":
          query = query.order('likes', { ascending: false });
          break;
        case "بیشترین بازدید":
          query = query.order('views', { ascending: false });
          break;
        case "بیشترین نظر":
          query = query.order('comments_count', { ascending: false });
          break;
        default:
          query = query.order('published_at', { ascending: false });
      }

      // Apply pagination
      const from = (currentPage - 1) * articlesPerPage;
      const to = from + articlesPerPage - 1;
      query = query.range(from, to);

      const { data: articlesData, count } = await query;

      if (articlesData) {
        setArticles(articlesData);
        setTotalPages(Math.ceil((count || 0) / articlesPerPage));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalArticlesCount = async () => {
    const { count } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');
    return count || 0;
  };

  const filteredArticles = articles.filter(article => {
    return article.title.includes(searchTerm) || article.excerpt?.includes(searchTerm);
  });

  return (
    <PersianLayout variant="default">
      {/* Header - Matching nigardip.site design */}
      <header className="bg-gradient-to-br from-primary via-primary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/800')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Star className="h-5 w-5" />
              <span className="font-medium">اخبار و مقالات تخصصی</span>
            </div>
            <h1 className="text-5xl font-black mb-4">
              نیگار آی‌پی - مقالات
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              بررسی و تحلیل جامع IP، تست سرعت پیشرفته، امنیت شبکه و DNS بهینه
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold">98.7%</div>
                <div className="text-sm opacity-80">رضایت</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">56,789</div>
                <div className="text-sm opacity-80">کاربر</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm opacity-80">مقاله</div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute right-4 top-4 h-5 w-5 text-white/70" />
              <Input
                placeholder="جستجو در مقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <PersianButton
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="h-12 px-6"
              >
                <span className="ml-2">{category.icon}</span>
                {category.name}
                {category.count > 0 && (
                  <Badge variant="secondary" className="mr-2 text-xs">
                    {category.count}
                  </Badge>
                )}
              </PersianButton>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {["جدیدترین", "محبوب‌ترین", "بیشترین بازدید", "بیشترین نظر"].map((filter) => (
              <PersianButton
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="h-10"
              >
                {filter}
              </PersianButton>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, index) => (
              <PersianCard key={index} variant="elegant" className="animate-pulse">
                <div className="h-48 bg-secondary rounded-t-xl"></div>
                <PersianCardContent className="p-6">
                  <div className="h-6 bg-secondary rounded mb-3"></div>
                  <div className="h-4 bg-secondary rounded mb-2"></div>
                  <div className="h-4 bg-secondary rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-secondary rounded w-1/4"></div>
                    <div className="h-4 bg-secondary rounded w-1/4"></div>
                  </div>
                </PersianCardContent>
              </PersianCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredArticles.map((article, index) => (
              <PersianCard 
                key={article.id} 
                variant="elegant" 
                className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-4xl">{article.categories?.icon || '📄'}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge 
                      style={{ backgroundColor: article.categories?.color || '#6366f1' }}
                      className="text-white border-0 shadow-soft"
                    >
                      <span className="ml-1">{article.categories?.icon || '📄'}</span>
                      {article.categories?.name || 'عمومی'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {article.reading_time} دقیقه
                    </Badge>
                  </div>
                </div>
                
                <PersianCardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 leading-relaxed group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                    {article.excerpt || article.content?.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.profiles?.display_name || 'نویسنده'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(article.published_at || article.created_at).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{(article.views || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{article.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{article.comments_count || 0}</span>
                      </div>
                    </div>
                    
                    <PersianButton variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                      مطالعه
                    </PersianButton>
                  </div>
                </PersianCardContent>
              </PersianCard>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-8">
            <PersianButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" />
              قبلی
            </PersianButton>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PersianButton
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10"
                >
                  {page}
                </PersianButton>
              ))}
            </div>
            
            <PersianButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              بعدی
              <ChevronLeft className="h-4 w-4" />
            </PersianButton>
          </div>
        )}

        {/* Newsletter Section - Matching nigardip.site */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 gradient-text">📧 عضویت در خبرنامه</h2>
            <p className="text-muted-foreground mb-6">
              جدیدترین مقالات و آپدیت‌های امنیتی را مستقیماً دریافت کنید
            </p>
            
            <div className="flex gap-4 max-w-md mx-auto mb-6">
              <Input 
                placeholder="آدرس ایمیل شما..."
                className="flex-1"
              />
              <PersianButton variant="gradient">
                🚀 عضویت رایگان
              </PersianButton>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>✅ بدون اسپم</div>
              <div>🎁 محتوای اختصاصی</div>
              <div>🔒 حریم خصوصی محفوظ</div>
              <div>📊 ۳ از ۱۲ مقاله نمایش داده شده</div>
            </div>
          </div>
        </section>
      </div>
    </PersianLayout>
  );
};

export default Articles;