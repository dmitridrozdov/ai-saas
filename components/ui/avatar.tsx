"use client"

import * as React from "react"


// Utility functions for class name concatenation (assuming you'll keep this)
// import { cn } from "@/lib/utils"

// Placeholder implementation for cn if not provided in the scope
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

// --- Avatar Root Component (Replacement for AvatarPrimitive.Root) ---

const Avatar = React.forwardRef<
  HTMLDivElement, // Ref type changed from Radix to HTMLDivElement
  React.HTMLAttributes<HTMLDivElement> // Props type changed from Radix to standard HTML div attributes
>(({ className, ...props }, ref) => (
  <div // Replaced AvatarPrimitive.Root with a standard <div>
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
// Set a display name for better debugging, referencing the component's name
Avatar.displayName = "Avatar"

// --- Avatar Image Component (Replacement for AvatarPrimitive.Image) ---

const AvatarImage = React.forwardRef<
  HTMLImageElement, // Ref type changed from Radix to HTMLImageElement
  React.ImgHTMLAttributes<HTMLImageElement> // Props type changed from Radix to standard HTML img attributes
>(({ className, ...props }, ref) => (
  <img // Replaced AvatarPrimitive.Image with a standard <img>
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

// --- Avatar Fallback Component (Replacement for AvatarPrimitive.Fallback) ---

const AvatarFallback = React.forwardRef<
  HTMLDivElement, // Ref type changed from Radix to HTMLDivElement
  React.HTMLAttributes<HTMLDivElement> // Props type changed from Radix to standard HTML div attributes
>(({ className, ...props }, ref) => (
  <div // Replaced AvatarPrimitive.Fallback with a standard <div>
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }