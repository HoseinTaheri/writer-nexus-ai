import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const persianButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-vazir",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-elegant hover:shadow-glow hover:scale-105 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 hover:scale-105",
        outline: "border border-input bg-background shadow-soft hover:bg-accent hover:text-accent-foreground hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 hover:scale-105",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        gradient: "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elegant hover:scale-105 active:scale-95",
        glass: "glass-effect text-foreground hover:bg-white/20 hover:scale-105 backdrop-blur-lg",
        hero: "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elegant hover:scale-110 active:scale-95 text-base font-bold",
        success: "bg-success text-success-foreground shadow-soft hover:bg-success/90 hover:scale-105",
        warning: "bg-warning text-warning-foreground shadow-soft hover:bg-warning/90 hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface PersianButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof persianButtonVariants> {
  asChild?: boolean
}

const PersianButton = React.forwardRef<HTMLButtonElement, PersianButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(persianButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
PersianButton.displayName = "PersianButton"

export { PersianButton, persianButtonVariants }