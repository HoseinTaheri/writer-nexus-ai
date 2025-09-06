import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent, PersianCardDescription, PersianCardHeader, PersianCardTitle } from "@/components/ui/persian-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, ArrowRight, UserPlus, Home } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (!error) {
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        setDisplayName("");
      }
    } else {
      const { error } = await signIn(email, password);
      if (!error) {
        navigate("/dashboard");
      }
    }
    
    setIsLoading(false);
  };

  return (
    <PersianLayout variant="hero">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <PersianCard variant="elegant" className="animate-scale-in">
            <PersianCardHeader className="space-y-1 text-center">
              <PersianCardTitle className="text-3xl font-bold gradient-text">
                {isSignUp ? "ثبت‌نام در پنل مدیریت" : "ورود به پنل مدیریت"}
              </PersianCardTitle>
              <PersianCardDescription className="text-base">
                {isSignUp ? "حساب جدید ایجاد کنید" : "برای دسترسی به پنل مدیریت نیگار دیپ وارد شوید"}
              </PersianCardDescription>
            </PersianCardHeader>

            <PersianCardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-right flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      نام نمایشی
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="نام کامل شما"
                      className="text-right"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    ایمیل
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="text-right"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    رمز عبور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="رمز عبور قوی"
                      required
                      className="text-right pl-10"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <PersianButton 
                  type="submit" 
                  variant="gradient" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isSignUp ? "در حال ثبت‌نام..." : "در حال ورود..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      {isSignUp ? "ثبت‌نام" : "ورود به پنل"}
                    </div>
                  )}
                </PersianButton>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setEmail("");
                    setPassword("");
                    setDisplayName("");
                  }}
                  className="text-primary hover:underline"
                >
                  {isSignUp ? "قبلاً حساب دارید؟ وارد شوید" : "حساب ندارید؟ ثبت‌نام کنید"}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t text-center">
                <PersianButton variant="ghost" size="sm" asChild>
                  <Link to="/" className="text-muted-foreground hover:text-foreground">
                    <Home className="ml-2 h-4 w-4" />
                    بازگشت به صفحه اصلی
                  </Link>
                </PersianButton>
              </div>
            </PersianCardContent>
          </PersianCard>
        </div>
      </div>
    </PersianLayout>
  );
};

export default Login;