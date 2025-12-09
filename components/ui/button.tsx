import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-800 text-white border-0",
        verify: "bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 text-white border-0 hover:bg-gradient-to-r hover:from-cyan-600 hover:via-cyan-700 hover:to-cyan-800",
        claude: "bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white border-0 hover:bg-gradient-to-r hover:from-amber-800 hover:via-amber-900 hover:to-stone-900",
        gemini: "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white border-0 hover:bg-gradient-to-r hover:from-purple-600 hover:via-purple-700 hover:to-purple-800",
        openai: "bg-gradient-to-r from-lime-500 via-lime-600 to-lime-700 text-white border-0 hover:bg-gradient-to-r hover:from-lime-600 hover:via-lime-700 hover:to-lime-800",
        clear: "bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white border-0 hover:bg-gradient-to-r hover:from-red-500 hover:via-red-600 hover:to-red-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }