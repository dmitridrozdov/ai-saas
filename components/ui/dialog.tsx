"use client"

import * as React from "react"
import * as ReactDOM from "react-dom" // Required for createPortal
import { X } from "lucide-react"

// Assuming this utility is available for Tailwind class merging
// import { cn } from "@/lib/utils"

// Placeholder for cn if not provided
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

// --- 1. Dialog Context and State Management ---

interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

const useDialogContext = () => {
  const context = React.useContext(DialogContext)
  if (context === undefined) {
    throw new Error("Dialog components must be used within <Dialog>")
  }
  return context
}

// --- 2. Root Component (Replacement for DialogPrimitive.Root) ---

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog = ({ open: controlledOpen, onOpenChange, children }: DialogProps) => {
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
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  )
}

// --- 3. Trigger and Close Components ---

// Replacement for DialogPrimitive.Trigger
const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { setOpen } = useDialogContext()
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true)
      onClick?.(event)
    },
    [setOpen, onClick]
  )
  return <button ref={ref} onClick={handleClick} {...props} />
})
DialogTrigger.displayName = "DialogTrigger"

// Replacement for DialogPrimitive.Close
const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { setOpen } = useDialogContext()
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(false)
      onClick?.(event)
    },
    [setOpen, onClick]
  )
  // This is a button that handles the closing logic
  return <button ref={ref} onClick={handleClick} {...props} />
})
DialogClose.displayName = "DialogClose"

// --- 4. Portal Component (Replacement for DialogPrimitive.Portal) ---

// Required to render the content outside the DOM tree
const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mountNode = typeof document !== 'undefined' ? document.body : null
  if (!mountNode) return null

  return ReactDOM.createPortal(children, mountNode)
}
DialogPortal.displayName = "DialogPortal"

// --- 5. Overlay Component (Replacement for DialogPrimitive.Overlay) ---

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useDialogContext()

  if (!open) return null // Manual conditional rendering since we lost Radix's automatic open state handling

  return (
    <div // Replaced DialogPrimitive.Overlay with a standard <div>
      ref={ref}
      // Note: Tailwind classes like data-[state=open]:animate-in are usually
      // handled automatically by Radix based on context. For a manual approach,
      // we either need to use a library like 'clsx' with a 'transitioning' state
      // or rely on a simple `opacity` transition on the `open` prop.
      // We keep the classes for styling but lose the Radix data-state hook.
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

// --- 6. Content Component (Replacement for DialogPrimitive.Content) ---

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useDialogContext()

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

  // Manually manage document scroll lock (Radix handles this automatically)
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);


  return (
    <DialogPortal>
      <DialogOverlay onClick={() => setOpen(false)} /> {/* Close on overlay click */}
      <div // Replaced DialogPrimitive.Content with a standard <div>
        ref={ref}
        role="dialog" // ARIA role for accessibility
        aria-modal="true" // ARIA attribute
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        tabIndex={-1} // Make it focusable
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>
    </DialogPortal>
  )
})
DialogContent.displayName = "DialogContent"

// --- 7. Title and Description Components (Replacements) ---

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 // Replaced DialogPrimitive.Title with a standard <h2>
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p // Replaced DialogPrimitive.Description with a standard <p>
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

// --- 8. Header and Footer (No Changes) ---

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}