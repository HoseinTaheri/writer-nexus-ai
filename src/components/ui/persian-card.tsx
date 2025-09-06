import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const persianCardVariants = cva(
  "rounded-2xl border text-card-foreground shadow-soft transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card hover:shadow-elegant hover:scale-[1.02]",
        gradient: "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elegant",
        glass: "glass-effect hover:bg-white/15",
        elegant: "bg-card shadow-elegant hover:shadow-glow hover:scale-[1.02]",
        minimal: "bg-card border-0 shadow-none hover:shadow-soft",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface PersianCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof persianCardVariants> {}

const PersianCard = React.forwardRef<HTMLDivElement, PersianCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(persianCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
PersianCard.displayName = "PersianCard"

const PersianCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-6", className)}
    {...props}
  />
))
PersianCardHeader.displayName = "PersianCardHeader"

const PersianCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-bold leading-none tracking-tight gradient-text", className)}
    {...props}
  />
))
PersianCardTitle.displayName = "PersianCardTitle"

const PersianCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
PersianCardDescription.displayName = "PersianCardDescription"

const PersianCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
))
PersianCardContent.displayName = "PersianCardContent"

const PersianCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6 border-t", className)}
    {...props}
  />
))
PersianCardFooter.displayName = "PersianCardFooter"

export { 
  PersianCard, 
  PersianCardHeader, 
  PersianCardFooter, 
  PersianCardTitle, 
  PersianCardDescription, 
  PersianCardContent,
  persianCardVariants 
}