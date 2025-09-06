import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent, PersianCardHeader, PersianCardTitle } from "@/components/ui/persian-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Eye, ArrowRight, Plus, X, Sparkles } from "lucide-react";

const ArticleEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [article, setArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    category_id: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published"
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    fetchCategories();
    
    if (isEditing) {
      fetchArticle();
    }
  }, [user, id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) {
      setCategories(data);
    }
  };

  const fetchArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: "خطا",
        description: "مقاله یافت نشد",
        variant: "destructive"
      });
      navigate("/dashboard");
      return;
    }

    if (data) {
      setArticle({
        title: data.title,
        content: data.content || "",
        excerpt: data.excerpt || "",
        category_id: data.category_id || "",
        tags: data.tags || [],
        status: data.status as "draft" | "published"
      });
    }
    setLoading(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!article.title.trim()) {
      toast({
        title: "خطا",
        description: "عنوان مقاله الزامی است",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    
    const slug = article.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    const articleData = {
      ...article,
      status,
      slug: `${slug}-${Date.now()}`,
      author_id: user?.id,
      reading_time: calculateReadingTime(article.content),
      published_at: status === 'published' ? new Date().toISOString() : null
    };

    let result;
    
    if (isEditing) {
      result = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', id);
    } else {
      result = await supabase
        .from('articles')
        .insert([articleData]);
    }

    if (result.error) {
      toast({
        title: "خطا",
        description: "خطا در ذخیره مقاله",
        variant: "destructive"
      });
    } else {
      toast({
        title: "موفقیت",
        description: `مقاله با موفقیت ${status === 'published' ? 'منتشر' : 'ذخیره'} شد`,
      });
      navigate("/dashboard");
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <PersianLayout variant="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PersianLayout>
    );
  }

  return (
    <PersianLayout variant="dashboard">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {isEditing ? "ویرایش مقاله" : "مقاله جدید"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? "مقاله خود را ویرایش کنید" : "مقاله جدید ایجاد کنید"}
              </p>
            </div>
            
            <PersianButton
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </PersianButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2">
              <PersianCard variant="elegant">
                <PersianCardHeader>
                  <PersianCardTitle>محتوای مقاله</PersianCardTitle>
                </PersianCardHeader>
                <PersianCardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">عنوان مقاله *</Label>
                    <Input
                      id="title"
                      value={article.title}
                      onChange={(e) => setArticle(prev => ({...prev, title: e.target.value}))}
                      placeholder="عنوان جذاب برای مقاله خود وارد کنید"
                      className="text-right"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">خلاصه مقاله</Label>
                    <Textarea
                      id="excerpt"
                      value={article.excerpt}
                      onChange={(e) => setArticle(prev => ({...prev, excerpt: e.target.value}))}
                      placeholder="خلاصه‌ای کوتاه از مقاله..."
                      className="text-right resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">محتوای مقاله *</Label>
                    <Textarea
                      id="content"
                      value={article.content}
                      onChange={(e) => setArticle(prev => ({...prev, content: e.target.value}))}
                      placeholder="محتوای کامل مقاله خود را اینجا بنویسید..."
                      className="text-right resize-none"
                      rows={20}
                    />
                  </div>
                </PersianCardContent>
              </PersianCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Actions */}
              <PersianCard variant="elegant">
                <PersianCardHeader>
                  <PersianCardTitle>انتشار</PersianCardTitle>
                </PersianCardHeader>
                <PersianCardContent className="space-y-4">
                  <div className="flex gap-2">
                    <PersianButton
                      variant="outline"
                      onClick={() => handleSave("draft")}
                      disabled={saving}
                      className="flex-1"
                    >
                      <Save className="ml-2 h-4 w-4" />
                      ذخیره پیش‌نویس
                    </PersianButton>
                    <PersianButton
                      variant="gradient"
                      onClick={() => handleSave("published")}
                      disabled={saving}
                      className="flex-1"
                    >
                      <Eye className="ml-2 h-4 w-4" />
                      انتشار
                    </PersianButton>
                  </div>
                  
                  <PersianButton
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Sparkles className="ml-2 h-4 w-4" />
                    تولید با AI
                  </PersianButton>
                </PersianCardContent>
              </PersianCard>

              {/* Category */}
              <PersianCard variant="elegant">
                <PersianCardHeader>
                  <PersianCardTitle>دسته‌بندی</PersianCardTitle>
                </PersianCardHeader>
                <PersianCardContent>
                  <Select 
                    value={article.category_id} 
                    onValueChange={(value) => setArticle(prev => ({...prev, category_id: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PersianCardContent>
              </PersianCard>

              {/* Tags */}
              <PersianCard variant="elegant">
                <PersianCardHeader>
                  <PersianCardTitle>برچسب‌ها</PersianCardTitle>
                </PersianCardHeader>
                <PersianCardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="برچسب جدید..."
                      className="text-right"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <PersianButton
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-4 w-4" />
                    </PersianButton>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </PersianCardContent>
              </PersianCard>

              {/* Stats */}
              <PersianCard variant="elegant">
                <PersianCardHeader>
                  <PersianCardTitle>آمار</PersianCardTitle>
                </PersianCardHeader>
                <PersianCardContent className="space-y-2 text-sm text-muted-foreground">
                  <div>کلمات: {article.content.split(/\s+/).filter(word => word.length > 0).length}</div>
                  <div>زمان مطالعه: {calculateReadingTime(article.content)} دقیقه</div>
                  <div>کاراکترها: {article.content.length}</div>
                </PersianCardContent>
              </PersianCard>
            </div>
          </div>
        </div>
      </div>
    </PersianLayout>
  );
};

export default ArticleEditor;