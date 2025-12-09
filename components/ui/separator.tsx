"use client"

import * as React from "react"

import { cn } from "@/lib/utils" // Assuming this utility is available

// --- Type Definition ---

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The orientation of the separator.
   * Default: "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Whether the separator is purely visual/decorative or semantic.
   * Default: true
   * If false, ARIA attributes for accessibility will be applied.
   */
  decorative?: boolean;
}

// --- Separator Component (REPLACED RADIX DEPENDENCY) ---

const Separator = React.forwardRef<
  HTMLDivElement, // Ref type changed from Radix to standard HTMLDivElement
  SeparatorProps  // Props type uses standard HTML attributes and custom properties
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => {

    // Accessibility attributes based on decorative prop
    const role = decorative ? 'none' : 'separator';
    const ariaOrientation = decorative ? undefined : orientation;

    return (
      <div // Replaced SeparatorPrimitive.Root with a standard <div>
        ref={ref}
        role={role}
        aria-orientation={ariaOrientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    )
  }
)
Separator.displayName = "Separator" // Use a plain string display name

export { Separator }