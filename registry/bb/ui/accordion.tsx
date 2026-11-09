"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronRightIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type AccordionVariant = "card" | "item"

const AccordionVariantContext = React.createContext<AccordionVariant>("card")

const accordionItemVariants = cva("border border-border", {
  variants: {
    variant: {
      card: "rounded-xl bg-card",
      // Opaque card fill under the tinted trigger: the tint looks the same on
      // any background, so the muted meta text keeps its contrast.
      item: "rounded-md bg-card",
    },
  },
  defaultVariants: { variant: "card" },
})

const accordionTriggerVariants = cva(
  "group/accordion-trigger flex w-full flex-1 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        card: "items-center gap-2 rounded-xl px-5 py-4 text-base font-semibold text-primary",
        item: "items-start gap-3 rounded-md p-3 text-sm font-medium text-foreground data-[state=closed]:bg-muted/60",
      },
    },
    defaultVariants: { variant: "card" },
  }
)

const accordionBodyVariants = cva("flex flex-col gap-3 text-sm", {
  variants: {
    variant: {
      card: "px-5 pb-5",
      item: "border-t border-border p-3",
    },
  },
  defaultVariants: { variant: "card" },
})

type AccordionSingleProps = Omit<
  AccordionPrimitive.AccordionSingleProps,
  "type"
> & { type?: "single" }

type AccordionProps = (
  AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps
) & {
  /** `card`: each section is a bordered card. `item`: compact tinted rows. */
  variant?: AccordionVariant
  ref?: React.Ref<HTMLDivElement>
}

function Accordion({ className, variant = "card", ...props }: AccordionProps) {
  const rootClassName = cn("flex w-full flex-col gap-2", className)

  return (
    <AccordionVariantContext value={variant}>
      {props.type === "multiple" ? (
        <AccordionPrimitive.Root
          data-slot="accordion"
          data-variant={variant}
          className={rootClassName}
          {...props}
        />
      ) : (
        <AccordionPrimitive.Root
          data-slot="accordion"
          data-variant={variant}
          className={rootClassName}
          {...props}
          type="single"
          collapsible={props.collapsible ?? true}
        />
      )}
    </AccordionVariantContext>
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const variant = React.use(AccordionVariantContext)

  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  )
}

type HeadingLevel = 2 | 3 | 4 | 5 | 6

function AccordionTrigger({
  className,
  children,
  meta,
  headingLevel = 3,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  /** Second, muted line under the title (item variant). */
  meta?: React.ReactNode
  /** Level of the heading around the trigger; pick the one that fits the page. */
  headingLevel?: HeadingLevel
}) {
  const variant = React.use(AccordionVariantContext)
  const Heading = `h${headingLevel}` as const

  return (
    <AccordionPrimitive.Header asChild>
      <Heading
        data-slot="accordion-header"
        className="flex font-sans tracking-normal"
      >
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(accordionTriggerVariants({ variant }), className)}
          {...props}
        >
          <ChevronRightIcon
            data-slot="accordion-chevron"
            aria-hidden="true"
            className={cn(
              "pointer-events-none size-4 shrink-0 group-data-[state=open]/accordion-trigger:rotate-90 motion-safe:transition-transform",
              variant === "item" && "mt-0.5 text-brand-cyan"
            )}
          />
          <span data-slot="accordion-title" className="min-w-0 flex-1">
            {children}
            {meta && (
              <span
                data-slot="accordion-meta"
                className="block text-xs font-normal text-muted-foreground"
              >
                {meta}
              </span>
            )}
          </span>
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const variant = React.use(AccordionVariantContext)

  return (
    <AccordionPrimitive.Content data-slot="accordion-content" {...props}>
      <div
        data-slot="accordion-body"
        className={cn(accordionBodyVariants({ variant }), className)}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
