import { useState } from "react";
import { Link } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent } from "@/components/ui/persian-card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  Eye, 
  Home, 
  User, 
  Clock,
  Heart,
  Share2,
  BookOpen,
  Filter
} from "lucide-react";

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock articles data - exactly like nigardip.site style
  const articles = [
    {
      id: 1,
      title: "راهنمای کامل بهینه‌سازی SEO برای وب‌سایت‌های فارسی",
      excerpt: "در این مقاله جامع، تکنیک‌های پیشرفته SEO برای بهبود رتبه‌بندی وب‌سایت‌های فارسی در موتورهای جستجو بررسی می‌شود. از کلمات کلیدی تا ساختار لینک‌سازی...",
      author: "علی محمدی",
      publishDate: "1403/08/15",
      readTime: "8 دقیقه",
      views: 1250,
      likes: 45,
      category: "بازاریابی دیجیتال",
      image: "/api/placeholder/400/240",
      featured: true
    },
    {
      id: 2,
      title: "آموزش طراحی رابط کاربری مدرن با Figma",
      excerpt: "کاوش در دنیای طراحی UI/UX و یادگیری اصول بنیادی طراحی رابط‌های کاربری که تجربه کاربری بهتری ارائه می‌دهند. از اصول رنگ‌شناسی تا تایپوگرافی...",
      author: "مریم احمدی",
      publishDate: "1403/08/12",
      readTime: "12 دقیقه",
      views: 980,
      likes: 32,
      category: "طراحی",
      image: "/api/placeholder/400/240"
    },
    {
      id: 3,
      title: "برنامه‌نویسی React از صفر تا صد",
      excerpt: "آموزش کامل کتابخانه React.js برای توسعه‌دهندگان مبتدی و پیشرفته. شامل hooks، context API، state management و بهترین شیوه‌های کدنویسی...",
      author: "حسین کریمی",
      publishDate: "1403/08/10",
      readTime: "15 دقیقه",
      views: 1580,
      likes: 67,
      category: "برنامه‌نویسی",
      image: "/api/placeholder/400/240"
    },
    {
      id: 4,
      title: "هوش مصنوعی و آینده تولید محتوا",
      excerpt: "بررسی تأثیر هوش مصنوعی بر صنعت تولید محتوا و بازاریابی دیجیتال. از ابزارهای GPT تا تولید تصاویر هوشمند و اتوماسیون فرآیندهای تولید محتوا...",
      author: "دکتر رضا نوری",
      publishDate: "1403/08/08",
      readTime: "10 دقیقه",
      views: 2100,
      likes: 89,
      category: "فناوری",
      image: "/api/placeholder/400/240",
      featured: true
    },
    {
      id: 5,
      title: "استراتژی‌های موفق در شبکه‌های اجتماعی",
      excerpt: "راهکارهای عملی برای افزایش فالوور، بهبود engagement و تبدیل مخاطبان به مشتریان وفادار در پلتفرم‌های مختلف شبکه‌های اجتماعی...",
      author: "سارا موسوی",
      publishDate: "1403/08/05",
      readTime: "6 دقیقه",
      views: 750,
      likes: 28,
      category: "بازاریابی دیجیتال",
      image: "/api/placeholder/400/240"
    },
    {
      id: 6,
      title: "آموزش Node.js و ساخت API های RESTful",
      excerpt: "یادگیری کامل Node.js برای توسعه backend، ساخت API های حرفه‌ای، کار با دیتابیس MongoDB و پیاده‌سازی سیستم‌های احراز هویت امن...",
      author: "امیر حسینی",
      publishDate: "1403/08/03",
      readTime: "18 دقیقه",
      views: 1420,
      likes: 56,
      category: "برنامه‌نویسی",
      image: "/api/placeholder/400/240"
    }
  ];

  const categories = ["همه", "برنامه‌نویسی", "طراحی", "بازاریابی دیجیتال", "فناوری"];
  const [selectedCategory, setSelectedCategory] = useState("همه");

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "همه" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <PersianLayout variant="default">
      {/* Header */}
      <header className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl font-black mb-4">
              مقالات و محتواهای آموزشی
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              مجموعه‌ای از بهترین مقالات در زمینه تکنولوژی، طراحی و بازاریابی دیجیتال
            </p>
            
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
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <PersianButton variant="outline" asChild>
              <Link to="/">
                <Home className="ml-2 h-4 w-4" />
                بازگشت به خانه
              </Link>
            </PersianButton>
            
            <PersianButton variant="gradient" asChild>
              <Link to="/login">
                <User className="ml-2 h-4 w-4" />
                ورود به پنل
              </Link>
            </PersianButton>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">دسته‌بندی:</span>
            </div>
            {categories.map((category) => (
              <PersianButton
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </PersianButton>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {searchTerm === "" && selectedCategory === "همه" && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 gradient-text">مقالات ویژه</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <PersianCard key={article.id} variant="elegant" className="group hover:scale-[1.02] transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <div className="h-48 bg-gradient-accent"></div>
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      ویژه
                    </div>
                  </div>
                  
                  <PersianCardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium">
                        {article.category}
                      </span>
                      <Calendar className="h-4 w-4" />
                      <span>{article.publishDate}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {article.likes}
                        </span>
                      </div>
                    </div>
                  </PersianCardContent>
                </PersianCard>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold gradient-text">
              {searchTerm ? `نتایج جستجو برای "${searchTerm}"` : "همه مقالات"}
            </h2>
            <span className="text-muted-foreground">
              {filteredArticles.length} مقاله پیدا شد
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <PersianCard key={article.id} variant="default" className="group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className="h-48 bg-gradient-subtle"></div>
                  {article.featured && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      ویژه
                    </div>
                  )}
                </div>
                
                <PersianCardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-lg font-medium">
                      {article.category}
                    </span>
                    <Calendar className="h-4 w-4" />
                    <span>{article.publishDate}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {article.views.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <PersianButton variant="outline" size="sm">
                      <BookOpen className="ml-2 h-4 w-4" />
                      مطالعه
                    </PersianButton>
                    
                    <div className="flex items-center gap-2">
                      <PersianButton variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </PersianButton>
                      <PersianButton variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </PersianButton>
                    </div>
                  </div>
                </PersianCardContent>
              </PersianCard>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">هیچ مقاله‌ای پیدا نشد</h3>
              <p className="text-muted-foreground">لطفاً کلمات کلیدی یا فیلترهای دیگری امتحان کنید</p>
            </div>
          )}
        </section>
      </div>
    </PersianLayout>
  );
};

export default Articles;