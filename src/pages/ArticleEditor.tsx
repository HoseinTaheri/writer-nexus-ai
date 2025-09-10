import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent, PersianCardHeader, PersianCardTitle } from "@/components/ui/persian-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Brain, Loader2, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ArticleEditor = () => {
  const [article, setArticle] = useState({
    title: '', content: '', excerpt: '', category_id: '', status: 'draft'
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const isAiMode = searchParams.get('ai') === 'true';

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCategories();
    if (isAiMode) setIsAiDialogOpen(true);
  }, [user, isAiMode]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-article-generator', {
        body: { prompt: aiPrompt, provider: 'gapgpt', model: 'gpt-4o' }
      });

      if (error) throw error;

      setArticle(prev => ({
        ...prev,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt
      }));

      setIsAiDialogOpen(false);
      toast({ title: "مقاله تولید شد!", description: "محتوا با موفقیت ایجاد شد" });
    } catch (error: any) {
      toast({
        title: "خطا در تولید",
        description: error.message || "نتوانستیم مقاله را تولید کنیم",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const saveArticle = async () => {
    if (!article.title || !article.content) {
      toast({ title: "خطا", description: "عنوان و محتوا الزامی است", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const articleData = {
        ...article,
        author_id: user?.id,
        slug: article.title.toLowerCase().replace(/\s+/g, '-'),
        reading_time: Math.ceil(article.content.length / 1000)
      };

      const { error } = await supabase.from('articles').insert(articleData);
      if (error) throw error;

      toast({ title: "ذخیره شد!", description: "مقاله با موفقیت ذخیره شد" });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "خطا در ذخیره",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PersianLayout variant="dashboard">
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <PersianButton variant="ghost" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  بازگشت
                </PersianButton>
                <h1 className="text-2xl font-bold gradient-text">ویرایشگر مقاله</h1>
              </div>

              <div className="flex gap-2">
                <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                  <DialogTrigger asChild>
                    <PersianButton variant="outline">
                      <Brain className="ml-2 h-4 w-4" />
                      تولید با AI
                    </PersianButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>تولید مقاله با هوش مصنوعی</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="موضوع مقاله را وارد کنید..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={3}
                      />
                      <PersianButton 
                        onClick={generateWithAI} 
                        disabled={aiGenerating || !aiPrompt.trim()}
                        className="w-full"
                      >
                        {aiGenerating ? (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="ml-2 h-4 w-4" />
                        )}
                        تولید مقاله
                      </PersianButton>
                    </div>
                  </DialogContent>
                </Dialog>

                <PersianButton onClick={saveArticle} disabled={saving}>
                  {saving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                  ذخیره
                </PersianButton>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PersianCard>
                <PersianCardContent className="p-6 space-y-6">
                  <div>
                    <Label>عنوان مقاله</Label>
                    <Input
                      value={article.title}
                      onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="عنوان جذاب برای مقاله"
                      className="text-lg font-semibold"
                    />
                  </div>

                  <div>
                    <Label>خلاصه</Label>
                    <Textarea
                      value={article.excerpt}
                      onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="خلاصه کوتاه از مقاله"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>محتوای مقاله</Label>
                    <Textarea
                      value={article.content}
                      onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="محتوای کامل مقاله (پشتیبانی از مارک‌داون)"
                      rows={20}
                      className="font-mono"
                    />
                  </div>
                </PersianCardContent>
              </PersianCard>
            </div>

            <div className="space-y-6">
              <PersianCard>
                <PersianCardHeader>
                  <PersianCardTitle>تنظیمات انتشار</PersianCardTitle>
                </PersianCardHeader>
                <PersianCardContent className="space-y-4">
                  <div>
                    <Label>دسته‌بندی</Label>
                    <Select value={article.category_id} onValueChange={(value) => setArticle(prev => ({ ...prev, category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>وضعیت</Label>
                    <Select value={article.status} onValueChange={(value) => setArticle(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">پیش‌نویس</SelectItem>
                        <SelectItem value="published">منتشر شده</SelectItem>
                        <SelectItem value="scheduled">زمان‌بندی شده</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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