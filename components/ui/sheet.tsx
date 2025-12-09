"use client"

import * as React from "react"
import * as ReactDOM from "react-dom"
// import * as SheetPrimitive from "@radix-ui/react-dialog" // Removed Radix Import
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils" // Assuming this utility is available

// --- 1. Dialog/Sheet Context and State Management ---

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | undefined>(undefined)

const useSheetContext = () => {
  const context = React.useContext(SheetContext)
  if (context === undefined) {
    throw new Error("Sheet components must be used within <Sheet>")
  }
  return context
}

// --- 2. Root Component (Replacement for SheetPrimitive.Root) ---

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Sheet = ({ open: controlledOpen, onOpenChange, children }: SheetProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  const contextValue = React.useMemo(() => ({ open, setOpen }), [open, setOpen])

  return (
    <SheetContext.Provider value={contextValue}>
      {children}
    </SheetContext.Provider>
  )
}
Sheet.displayName = "Sheet"

// --- 3. Trigger and Close Components ---

// Replacement for SheetPrimitive.Trigger
const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { setOpen } = useSheetContext()
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true)
      onClick?.(event)
    },
    [setOpen, onClick]
  )
  return <button ref={ref} onClick={handleClick} {...props} />
})
SheetTrigger.displayName = "SheetTrigger"

// Replacement for SheetPrimitive.Close
const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { setOpen } = useSheetContext()
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(false)
      onClick?.(event)
    },
    [setOpen, onClick]
  )
  return <button ref={ref} onClick={handleClick} {...props} />
})
SheetClose.displayName = "SheetClose"

// --- 4. Portal Component (Replacement for SheetPrimitive.Portal) ---

const SheetPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mountNode = typeof document !== 'undefined' ? document.body : null
  if (!mountNode) return null

  return ReactDOM.createPortal(children, mountNode)
}
SheetPortal.displayName = "SheetPortal"

// --- 5. Overlay Component (Replacement for SheetPrimitive.Overlay) ---

const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSheetContext()

  if (!open) return null // Manual conditional rendering

  return (
    <div // Replaced SheetPrimitive.Overlay with a standard <div>
      ref={ref}
      // Note: Retaining data-state classes but they rely on external styling logic
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
})
SheetOverlay.displayName = "SheetOverlay"

// --- 6. Content Component (Replacement for SheetPrimitive.Content) ---

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>, // Changed from Radix props to standard HTML div props
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  HTMLDivElement, // Changed from Radix ElementRef to HTMLDivElement
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const { open, setOpen } = useSheetContext()

  if (!open) return null

  // Manually handle Escape key to close
  React.useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeydown)
    return () => document.removeEventListener("keydown", handleKeydown)
  }, [setOpen])

  // Manually manage document scroll lock
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <SheetPortal>
      <SheetOverlay onClick={() => setOpen(false)} /> {/* Close on overlay click */}
      <div // Replaced SheetPrimitive.Content with a standard <div>
        ref={ref}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </div>
    </SheetPortal>
  )
})
SheetContent.displayName = "SheetContent"

// --- 7. Header and Footer (No Changes) ---

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

// --- 8. Title and Description Components (Replacements) ---

const SheetTitle = React.forwardRef<
  HTMLHeadingElement, // Changed from Radix ElementRef to HTMLHeadingElement
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 // Replaced SheetPrimitive.Title with a standard <h2>
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
  HTMLParagraphElement, // Changed from Radix ElementRef to HTMLParagraphElement
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p // Replaced SheetPrimitive.Description with a standard <p>
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}