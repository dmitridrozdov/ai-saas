import * as React from "react"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

// Utility functions for class name concatenation (assuming you'll keep this)
// This file needs to be implemented or replaced, e.g., by a simple string join
// import { cn } from "@/lib/utils"

// Local Label component (assuming you'll keep this)
// import { Label } from "@/components/ui/label" 

// Placeholder implementations for dependencies if not provided
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");
const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
  )
)
Label.displayName = "Label"


// --- Form Context Setup (No Changes) ---

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext || !itemContext) {
    throw new Error("useFormField should be used within <FormField> and <FormItem>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

// --- FormItem (No Changes) ---

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

// --- FormLabel (REPLACED RADIX DEPENDENCY) ---

const FormLabel = React.forwardRef<
  HTMLLabelElement, // <-- Replaced typeof LabelPrimitive.Root with HTMLLabelElement
  React.ComponentPropsWithoutRef<typeof Label> // <-- Using the local Label component's props
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label // Assuming '@/components/ui/label' is a standard label component
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

// --- FormControl (REPLACED RADIX DEPENDENCY) ---

// Replacing Slot means we can't reliably pass props to an unknown child.
// The standard non-Radix approach is to wrap children in a Fragment and rely on
// the form element itself to receive the necessary ref/id/aria props via the 'props' spread.

const FormControl = React.forwardRef<
  HTMLElement, // <-- Replaced typeof Slot with a generic HTMLElement ref
  React.HTMLAttributes<HTMLElement> // <-- Replaced ComponentPropsWithoutRef<typeof Slot> with generic HTML attributes
>(({ children, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  // We rely on the child element (e.g., <Input />) to correctly spread these props.
  // We'll use React.cloneElement to inject the necessary props into the child.
  
  if (React.Children.count(children) !== 1) {
    throw new Error("FormControl must have exactly one child element.")
  }

  const child = React.Children.only(children) as React.ReactElement;

  return (
    <>
      {React.cloneElement(child, {
        ref,
        id: formItemId,
        'aria-describedby': !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`,
        'aria-invalid': !!error,
        ...props, // Spread remaining props, e.g., className, onto the child
      })}
    </>
  )
})
FormControl.displayName = "FormControl"


// --- FormDescription (No Changes) ---

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

// --- FormMessage (No Changes) ---

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}