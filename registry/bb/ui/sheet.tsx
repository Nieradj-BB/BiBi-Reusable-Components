"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Real, tabbable fields only: Radix Select and Checkbox add a hidden native
// control (aria-hidden, tabindex -1) inside forms that must not take focus.
const FIRST_FIELD_SELECTOR = [
  "input:not([type=hidden])",
  "textarea",
  "select",
  "button[role=combobox]",
  "button[role=checkbox]",
]
  .map(
    (field) =>
      `${field}:not(:disabled):not([tabindex="-1"]):not([aria-hidden="true"])`
  )
  .join(", ")

const SheetContext = React.createContext<{ modal: boolean }>({ modal: false })
const SheetContentContext = React.createContext<{ showCloseButton: boolean }>({
  showCloseButton: false,
})

/** Non-modal by default: the page next to the sheet stays usable. */
function Sheet({
  modal = false,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const context = React.useMemo(() => ({ modal }), [modal])

  return (
    <SheetContext.Provider value={context}>
      <SheetPrimitive.Root data-slot="sheet" modal={modal} {...props} />
    </SheetContext.Provider>
  )
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-primary/40", className)}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  closeLabel = "Paneel sluiten",
  onInteractOutside,
  onOpenAutoFocus,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "right" | "left"
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const { modal } = React.useContext(SheetContext)
  const context = React.useMemo(() => ({ showCloseButton }), [showCloseButton])
  const Panel = modal ? "div" : "aside"

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        // Non-modal: a labelled <aside> instead of a dialog, and clicks on the
        // page next to it do not close it.
        role={modal ? "dialog" : undefined}
        aria-modal={modal ? true : undefined}
        onInteractOutside={(event) => {
          onInteractOutside?.(event)
          if (!modal) event.preventDefault()
        }}
        // Non-modal: the panel itself takes focus. Modal: the first field, so
        // focus skips the scrollable body region.
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event)
          const panel = event.target
          if (event.defaultPrevented || !(panel instanceof HTMLElement)) return
          const target = modal
            ? panel.querySelector<HTMLElement>(FIRST_FIELD_SELECTOR)
            : panel
          if (!target) return
          event.preventDefault()
          target.focus()
        }}
        asChild
        {...props}
      >
        <Panel
          className={cn(
            "fixed inset-y-0 z-50 flex flex-col bg-card text-foreground shadow-panel focus:outline-none",
            side === "right" &&
              "right-0 w-full border-l border-border lg:w-140 2xl:w-160",
            side === "left" &&
              "left-0 w-[min(85%,18rem)] border-r border-border",
            className
          )}
        >
          <SheetContentContext.Provider value={context}>
            {children}
          </SheetContentContext.Provider>
          {showCloseButton && (
            <SheetPrimitive.Close asChild>
              <Button
                data-slot="sheet-close"
                variant="ghost"
                size="icon-sm"
                aria-label={closeLabel}
                className="absolute top-6 right-6"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </SheetPrimitive.Close>
          )}
        </Panel>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { showCloseButton } = React.useContext(SheetContentContext)

  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex min-w-0 flex-col border-b border-border bg-card p-6",
        showCloseButton && "min-h-20.25 pr-18",
        className
      )}
      {...props}
    />
  )
}

/**
 * Scrolls on its own and is focusable, so keyboard users can scroll it. A
 * region labelled by the sheet title unless `aria-label` or
 * `aria-labelledby` is given.
 */
function SheetBody({
  className,
  id,
  tabIndex = 0,
  role = "region",
  ...props
}: React.ComponentProps<"div">) {
  const generatedId = React.useId()
  const bodyId = id ?? generatedId
  const hasLabel = Boolean(props["aria-label"] || props["aria-labelledby"])

  // The title id is generated by Radix; point at it once both are mounted.
  React.useLayoutEffect(() => {
    if (hasLabel) return
    const body = document.getElementById(bodyId)
    const titleId = body
      ?.closest("[data-slot=sheet-content]")
      ?.querySelector("[data-slot=sheet-title]")?.id
    if (!body || !titleId) return
    body.setAttribute("aria-labelledby", titleId)
    return () => {
      if (body.getAttribute("aria-labelledby") === titleId) {
        body.removeAttribute("aria-labelledby")
      }
    }
  }, [bodyId, hasLabel])

  return (
    <div
      data-slot="sheet-body"
      id={bodyId}
      tabIndex={tabIndex}
      role={role}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

function SheetSection({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="sheet-section"
      className={cn("border-t-2 border-border pt-5", className)}
      {...props}
    />
  )
}

function SheetSectionTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="sheet-section-title"
      className={cn(
        "mb-3 text-xs font-bold tracking-widest text-brand-cyan uppercase",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "flex flex-wrap justify-end gap-2 border-t border-border bg-card px-6 py-4",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-2xl/tight", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("mt-1 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetSection,
  SheetSectionTitle,
  SheetTitle,
  SheetTrigger,
}
