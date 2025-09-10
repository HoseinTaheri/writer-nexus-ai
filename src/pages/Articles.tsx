import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent } from "@/components/ui/persian-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  User, 
  Eye, 
  Heart, 
  Clock, 
  Filter,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Calendar,
  BookOpen
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
  views: number;
  likes: number;
  reading_time: number;
  categories: { name: string; color: string } | null;
  profiles: { display_name: string } | null;
  status: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه دسته‌ها");
  const [categories, setCategories] = useState<{ name: string; color: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const articlesPerPage = 12;

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name, color')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('articles')
        .select(`
          *,
          categories(name, color),
          profiles(display_name)
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (selectedCategory !== "همه دسته‌ها") {
        query = query.eq('categories.name', selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .range((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage - 1);

      if (error) throw error;
      
      setArticles(data || []);
      setTotalPages(Math.ceil((count || 0) / articlesPerPage));
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "خطا در بارگیری",
        description: "نتوانستیم مقالات را بارگیری کنیم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId: string) => {
    try {
      const article = articles.find(a => a.id === articleId);
      if (!article) return;

      const { error } = await supabase
        .from('articles')
        .update({ likes: (article.likes || 0) + 1 })
        .eq('id', articleId);

      if (error) throw error;

      setArticles(articles.map(a => 
        a.id === articleId ? { ...a, likes: (a.likes || 0) + 1 } : a
      ));

      toast({
        title: "پسندیده شد!",
        description: "مقاله به لیست پسندیده‌ها اضافه شد",
      });
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const incrementView = async (articleId: string) => {
    try {
      const article = articles.find(a => a.id === articleId);
      if (!article) return;

      await supabase
        .from('articles')
        .update({ views: (article.views || 0) + 1 })
        .eq('id', articleId);
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  return (
    <PersianLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card/95 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">نیگار دیپ</h1>
                  <p className="text-sm text-muted-foreground">مجله علمی و فناوری</p>
                </div>
              </div>

              <PersianButton variant="default" asChild>
                <Link to="/login">
                  <LogIn className="ml-2 h-4 w-4" />
                  ورود به پنل
                </Link>
              </PersianButton>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="جستجو در مقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {["همه دسته‌ها", ...categories.map(c => c.name)].map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <PersianCard key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <PersianCardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </PersianCardContent>
                </PersianCard>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">مقاله‌ای یافت نشد</h3>
              <p className="text-muted-foreground">هنوز مقاله‌ای منتشر نشده است</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article, index) => (
                <PersianCard 
                  key={article.id} 
                  className="group hover:shadow-elegant transition-all duration-300 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => incrementView(article.id)}
                >
                  {article.featured_image && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {article.categories && (
                        <Badge 
                          className="absolute top-3 right-3"
                          style={{ backgroundColor: article.categories.color }}
                        >
                          {article.categories.name}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <PersianCardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.profiles?.display_name || 'ناشناس'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.created_at).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      {article.reading_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.reading_time} دقیقه
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(article.id);
                          }}
                          className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          <span>{article.likes || 0}</span>
                        </button>
                        
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{article.views || 0}</span>
                        </div>
                      </div>

                      <PersianButton variant="ghost" size="sm">
                        ادامه مطلب
                      </PersianButton>
                    </div>
                  </PersianCardContent>
                </PersianCard>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <PersianButton
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronRight className="h-4 w-4" />
                قبلی
              </PersianButton>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PersianButton
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PersianButton>
                  );
                })}
              </div>

              <PersianButton
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                بعدی
                <ChevronLeft className="h-4 w-4" />
              </PersianButton>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-card border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                © ۱۴۰۳ نیگار دیپ. تمامی حقوق محفوظ است.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                سیستم مدیریت محتوا
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PersianLayout>
  );
};

export default Articles;