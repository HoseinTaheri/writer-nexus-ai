import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent, PersianCardDescription, PersianCardHeader, PersianCardTitle } from "@/components/ui/persian-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Shield,
  Home
} from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Demo credentials for testing
  const demoCredentials = {
    email: "admin@nigardip.site",
    password: "Admin@2024"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (formData.email === demoCredentials.email && formData.password === demoCredentials.password) {
        toast({
          title: "ورود موفقیت‌آمیز",
          description: "خوش آمدید! به پنل مدیریت هدایت می‌شوید...",
        });
        
        // Store simple auth state
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", formData.email);
        
        navigate("/dashboard");
      } else {
        toast({
          title: "خطا در ورود",
          description: "ایمیل یا رمز عبور اشتباه است",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fillDemoCredentials = () => {
    setFormData(demoCredentials);
    toast({
      title: "اطلاعات تست پر شد",
      description: "برای ورود روی دکمه ورود کلیک کنید",
    });
  };

  return (
    <PersianLayout variant="hero">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="mx-auto w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              ورود به پنل مدیریت
            </h1>
            <p className="text-white/80">
              برای دسترسی به سیستم وارد شوید
            </p>
          </div>

          {/* Login Form */}
          <PersianCard variant="glass" className="animate-scale-in">
            <PersianCardHeader className="text-center">
              <PersianCardTitle className="text-white">
                احراز هویت
              </PersianCardTitle>
              <PersianCardDescription className="text-white/70">
                اطلاعات ورود خود را وارد کنید
              </PersianCardDescription>
            </PersianCardHeader>
            
            <PersianCardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    ایمیل
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@nigardip.site"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    رمز عبور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="رمز عبور خود را وارد کنید"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pr-10 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Demo Credentials Alert */}
                <div className="bg-primary/20 border border-primary/30 rounded-xl p-4">
                  <div className="text-sm text-white mb-2">
                    <strong>اطلاعات تست:</strong>
                  </div>
                  <div className="text-xs text-white/80 space-y-1">
                    <div>ایمیل: {demoCredentials.email}</div>
                    <div>رمز: {demoCredentials.password}</div>
                  </div>
                  <PersianButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={fillDemoCredentials}
                    className="mt-2 text-white hover:bg-white/10"
                  >
                    پر کردن خودکار
                  </PersianButton>
                </div>

                {/* Submit Button */}
                <PersianButton
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ArrowRight className="ml-2" />
                      ورود به پنل
                    </>
                  )}
                </PersianButton>
              </form>

              {/* Footer Links */}
              <div className="mt-6 pt-6 border-t border-white/20 text-center">
                <PersianButton variant="ghost" size="sm" asChild>
                  <Link to="/" className="text-white/80 hover:text-white">
                    <Home className="ml-2 h-4 w-4" />
                    بازگشت به صفحه اصلی
                  </Link>
                </PersianButton>
              </div>
            </PersianCardContent>
          </PersianCard>

          {/* Supabase Note */}
          <div className="mt-8 text-center">
            <PersianCard variant="glass" padding="sm">
              <div className="text-white/70 text-sm">
                💡 برای فعال‌سازی احراز هویت واقعی، پروژه را به Supabase متصل کنید
              </div>
            </PersianCard>
          </div>
        </div>
      </div>
    </PersianLayout>
  );
};

export default Login;