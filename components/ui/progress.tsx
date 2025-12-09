"use client"

import * as React from "react"

import { cn } from "@/lib/utils" // Assuming this utility is available

// --- Type Definition ---

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The current value of the progress bar (0 to 100). */
  value?: number | null | undefined;
}

// --- Progress Component (REPLACED RADIX DEPENDENCY) ---

const Progress = React.forwardRef<
  HTMLDivElement, // Ref type changed from Radix to standard HTMLDivElement
  ProgressProps   // Props type uses standard HTML attributes and includes 'value'
>(({ className, value, ...props }, ref) => {
  // Normalize value to ensure it's treated as a number between 0 and 100
  const progressValue = value === null || value === undefined ? 0 : value;
  const clampedValue = Math.min(100, Math.max(0, progressValue));

  return (
    <div // Replaced ProgressPrimitive.Root with a standard <div>
      ref={ref}
      // Manually added ARIA attributes for accessibility
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div // Replaced ProgressPrimitive.Indicator with a standard <div>
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{
          // Apply the transformation based on the value
          transform: `translateX(-${100 - clampedValue}%)`,
        }}
      />
    </div>
  )
})
Progress.displayName = "Progress" // Use a plain string display name

export { Progress }