"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority" // Retained for dynamic class generation

import { cn } from "@/lib/utils" // Assuming this utility is available

// --- 1. Variant Definition (No Change) ---

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// --- 2. Label Component (REPLACED RADIX DEPENDENCY) ---

// Define the props by combining standard HTML label attributes and the CVA variants
interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<
  HTMLLabelElement, // <-- Ref type changed from Radix to standard HTMLLabelElement
  LabelProps       // <-- Props type uses standard HTML attributes and CVA variants
>(({ className, ...props }, ref) => (
  <label // <-- Replaced LabelPrimitive.Root with a standard <label> element
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = "Label" // Use a plain string display name

export { Label }