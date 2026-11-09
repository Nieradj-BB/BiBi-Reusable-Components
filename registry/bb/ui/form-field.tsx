"use client"

import * as React from "react"
import { CircleAlertIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"

/**
 * Props a render-function child spreads on its focusable part. Required comes
 * as `aria-required`, which is valid on roles such as combobox and textbox but
 * not on a plain button: spread these props on a part with such a role (the
 * Select and DatePicker triggers are comboboxes). Put `required` on the
 * control itself (for example the Select root) for native validation.
 */
type FormFieldControlProps = {
  id: string
  "aria-describedby"?: string
  "aria-invalid"?: true
  "aria-required"?: true
}

type ControlElementProps = {
  id?: string
  "aria-describedby"?: string
  required?: boolean
}

function FormFieldRoot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-field"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function FormFieldHelp({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-field-help"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormFieldError({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-field-error"
      role="alert"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  )
}

function FormField({
  label,
  required = false,
  optional = false,
  help,
  error,
  id,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** Visible label, linked to the control. */
  label: React.ReactNode
  /**
   * Red asterisk on the label; `required` on an element child,
   * `aria-required` for a render function.
   */
  required?: boolean
  /** Shows the optional hint after the label. */
  optional?: boolean
  /** Help text under the control. */
  help?: React.ReactNode
  /** Error message under the help text; marks the control invalid. */
  error?: React.ReactNode
  /** Id of the control. Defaults to the child's id or a generated one. */
  id?: string
  /**
   * One control element, or a function that receives the props to spread on
   * the control (for composed controls such as a Select trigger).
   */
  children:
    | React.ReactElement<ControlElementProps>
    | ((control: FormFieldControlProps) => React.ReactNode)
}) {
  const generatedId = React.useId()
  const child =
    typeof children === "function" ? null : React.Children.only(children)
  const controlId = id ?? child?.props.id ?? generatedId
  const helpId = `${controlId}-help`
  const errorId = `${controlId}-error`
  const hasError = error !== undefined && error !== null && error !== false

  const describedBy =
    [
      child?.props["aria-describedby"],
      help ? helpId : undefined,
      hasError ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined

  const controlProps: FormFieldControlProps = { id: controlId }
  if (describedBy) controlProps["aria-describedby"] = describedBy
  if (hasError) controlProps["aria-invalid"] = true

  return (
    <FormFieldRoot className={className} {...props}>
      <Label
        htmlFor={controlId}
        required={required}
        optional={optional}
        className="mb-1"
      >
        {label}
      </Label>
      {child
        ? React.cloneElement(
            child,
            required ? { ...controlProps, required: true } : controlProps
          )
        : null}
      {typeof children === "function"
        ? children(
            required ? { ...controlProps, "aria-required": true } : controlProps
          )
        : null}
      {help && <FormFieldHelp id={helpId}>{help}</FormFieldHelp>}
      {hasError && <FormFieldError id={errorId}>{error}</FormFieldError>}
    </FormFieldRoot>
  )
}

/** Props a render-function child of FormFieldGroup spreads on its group. */
type FormFieldGroupControlProps = {
  "aria-invalid"?: true
  "aria-required"?: true
}

function FormFieldGroup({
  legend,
  required = false,
  requiredHint = "(verplicht)",
  optional = false,
  help,
  error,
  id,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"fieldset">, "children"> & {
  /** Visible legend of the group. */
  legend: React.ReactNode
  /**
   * Red asterisk on the legend; `aria-required` for a render function, else
   * hidden "(verplicht)" text in the legend.
   */
  required?: boolean
  /** Hidden legend text for a required group of element children. */
  requiredHint?: string
  /** Shows the optional hint after the legend. */
  optional?: boolean
  /** Help text under the options. */
  help?: React.ReactNode
  /** One error for the whole group, under the help text. */
  error?: React.ReactNode
  /** Id of the fieldset; the help and error ids derive from it. */
  id?: string
  /**
   * The options (checkboxes or a RadioGroup), or a function that receives
   * `aria-invalid` and `aria-required` to spread on a RadioGroup.
   */
  children:
    React.ReactNode | ((group: FormFieldGroupControlProps) => React.ReactNode)
}) {
  const generatedId = React.useId()
  const groupId = id ?? generatedId
  const helpId = `${groupId}-help`
  const errorId = `${groupId}-error`
  const hasError = error !== undefined && error !== null && error !== false
  const isRenderFunction = typeof children === "function"

  const groupProps: FormFieldGroupControlProps = {}
  if (hasError) groupProps["aria-invalid"] = true
  if (required) groupProps["aria-required"] = true

  const describedBy =
    [
      props["aria-describedby"],
      help ? helpId : undefined,
      hasError ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <fieldset
      data-slot="form-field-group"
      id={groupId}
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
      aria-describedby={describedBy}
    >
      <Label
        as="legend"
        required={required}
        optional={optional}
        className="mb-1"
      >
        {legend}
        {required && !isRenderFunction && (
          // Checkbox groups have no aria-required, so the legend says it.
          <span className="sr-only"> {requiredHint}</span>
        )}
      </Label>
      <div
        data-slot="form-field-group-options"
        className="mb-1 flex min-w-0 flex-col gap-2"
      >
        {typeof children === "function" ? children(groupProps) : children}
      </div>
      {help && <FormFieldHelp id={helpId}>{help}</FormFieldHelp>}
      {hasError && <FormFieldError id={errorId}>{error}</FormFieldError>}
    </fieldset>
  )
}

function FormFieldRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-field-row"
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-x-4 gap-y-5",
        className
      )}
      {...props}
    />
  )
}

function FormError({
  title,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Alert>, "variant" | "title"> & {
  /** Short bold summary above the message. */
  title?: React.ReactNode
}) {
  return (
    <Alert
      data-slot="form-error"
      variant="destructive"
      className={className}
      {...props}
    >
      <CircleAlertIcon aria-hidden="true" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

function FormStack({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Renders the stack on its child, for example a `<form>`. */
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="form-stack"
      className={cn("flex w-full max-w-md flex-col gap-5", className)}
      {...props}
    />
  )
}

function FormActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-actions"
      className={cn("flex flex-wrap justify-end gap-2 pt-1", className)}
      {...props}
    />
  )
}

export {
  FormField,
  FormFieldRoot,
  FormFieldHelp,
  FormFieldError,
  FormFieldGroup,
  FormFieldRow,
  FormError,
  FormStack,
  FormActions,
  type FormFieldControlProps,
  type FormFieldGroupControlProps,
}
