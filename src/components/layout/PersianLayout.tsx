import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PersianLayoutProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "hero" | "dashboard" | "minimal";
}

export const PersianLayout = ({ children, className, variant = "default" }: PersianLayoutProps) => {
  const variants = {
    default: "min-h-screen bg-gradient-subtle",
    hero: "min-h-screen bg-gradient-primary relative overflow-hidden",
    dashboard: "min-h-screen bg-background",
    minimal: "min-h-screen bg-background"
  };

  return (
    <div className={cn(variants[variant], className)}>
      {variant === "hero" && (
        <>
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-accent/20 rounded-full blur-lg animate-gentle-bounce"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-primary-glow/15 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }}></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/5 rounded-full blur-xl animate-gentle-bounce" style={{ animationDelay: "1s" }}></div>
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
        </>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};