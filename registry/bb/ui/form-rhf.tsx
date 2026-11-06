"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import {
  FormFieldError,
  FormFieldHelp,
  FormFieldRoot,
} from "@/components/ui/form-field"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
  hasDescription: boolean
  registerDescription: () => () => void
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)
  const { id, hasDescription } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    hasDescription,
    ...fieldState,
  }
}

function FormItem(props: React.ComponentProps<"div">) {
  const id = React.useId()
  const [descriptions, setDescriptions] = React.useState(0)

  const registerDescription = React.useCallback(() => {
    setDescriptions((count) => count + 1)
    return () => setDescriptions((count) => count - 1)
  }, [])

  const value = React.useMemo(
    () => ({ id, hasDescription: descriptions > 0, registerDescription }),
    [id, descriptions, registerDescription]
  )

  return (
    <FormItemContext.Provider value={value}>
      <FormFieldRoot data-slot="form-item" {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      htmlFor={formItemId}
      className={cn("mb-1", className)}
      {...props}
    />
  )
}

function FormControl(props: React.ComponentProps<typeof Slot.Root>) {
  const {
    error,
    formItemId,
    formDescriptionId,
    formMessageId,
    hasDescription,
  } = useFormField()

  const describedBy =
    [
      hasDescription ? formDescriptionId : undefined,
      error ? formMessageId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  )
}

function FormDescription(props: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()
  const item = React.useContext(FormItemContext)
  const register = item?.registerDescription

  React.useEffect(() => register?.(), [register])

  return (
    <FormFieldHelp
      data-slot="form-description"
      id={formDescriptionId}
      {...props}
    />
  )
}

function FormMessage({ children, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <FormFieldError data-slot="form-message" id={formMessageId} {...props}>
      {body}
    </FormFieldError>
  )
}

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
