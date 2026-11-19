"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const itemClassName = cn(
  "group/dropdown-menu-item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm whitespace-nowrap text-foreground transition-colors select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-accent",
  // Items take focus on hover too; the ring only shows while the keyboard is used.
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring in-data-[input=pointer]:focus-visible:outline-0",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg]:text-muted-foreground"
)

const panelClassName =
  "z-50 flex flex-col overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-card p-1 text-foreground shadow-panel focus:outline-none"

type DropdownMenuInput = "pointer" | "keyboard"

// Records whether the pointer or the keyboard moved the highlight last.
function trackInput<E extends HTMLElement>(
  lastInput: React.RefObject<DropdownMenuInput | undefined> | undefined,
  onPointerMove: React.PointerEventHandler<E> | undefined,
  onKeyDown: React.KeyboardEventHandler<E> | undefined
) {
  return {
    onPointerMove: (event: React.PointerEvent<E>) => {
      event.currentTarget.dataset.input = "pointer"
      if (lastInput) lastInput.current = "pointer"
      onPointerMove?.(event)
    },
    onKeyDown: (event: React.KeyboardEvent<E>) => {
      event.currentTarget.dataset.input = "keyboard"
      if (lastInput) lastInput.current = "keyboard"
      onKeyDown?.(event)
    },
  }
}

// After a pointer pick the trigger gets focus back without the ring; a key
// press brings the ring back, and leaving the trigger resets it.
function trackTriggerInput<E extends HTMLElement>(
  lastInput: React.RefObject<DropdownMenuInput | undefined> | undefined,
  {
    onFocus,
    onBlur,
    onKeyDown,
  }: {
    onFocus?: React.FocusEventHandler<E>
    onBlur?: React.FocusEventHandler<E>
    onKeyDown?: React.KeyboardEventHandler<E>
  }
) {
  return {
    onFocus: (event: React.FocusEvent<E>) => {
      if (lastInput?.current === "pointer") {
        event.currentTarget.dataset.input = "pointer"
      }
      onFocus?.(event)
    },
    onBlur: (event: React.FocusEvent<E>) => {
      delete event.currentTarget.dataset.input
      onBlur?.(event)
    },
    onKeyDown: (event: React.KeyboardEvent<E>) => {
      event.currentTarget.dataset.input = "keyboard"
      onKeyDown?.(event)
    },
  }
}

// Only the focus that returns to the trigger as the menu closes takes over
// its last input.
function forgetInput(
  lastInput: React.RefObject<DropdownMenuInput | undefined> | undefined
) {
  queueMicrotask(() => {
    if (lastInput) lastInput.current = undefined
  })
}

// While a modal menu is open the rest of the page is aria-hidden; the trigger
// leaves the tab order then so it is not a focusable element inside it.
// `lastInput` is the input last used in the open menu; the trigger takes it
// over as focus returns to it on close.
const DropdownMenuContext = React.createContext<{
  open: boolean
  lastInput?: React.RefObject<DropdownMenuInput | undefined>
}>({ open: false })

function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const lastInput = React.useRef<DropdownMenuInput>(undefined)
  const open = openProp ?? uncontrolledOpen
  const context = React.useMemo(
    () => ({ open: modal && open, lastInput }),
    [modal, open]
  )

  return (
    <DropdownMenuContext value={context}>
      <DropdownMenuPrimitive.Root
        data-slot="dropdown-menu"
        open={open}
        modal={modal}
        onOpenChange={(nextOpen) => {
          if (openProp === undefined) setUncontrolledOpen(nextOpen)
          onOpenChange?.(nextOpen)
        }}
        {...props}
      />
    </DropdownMenuContext>
  )
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  className,
  tabIndex,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  const { open, lastInput } = React.use(DropdownMenuContext)

  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      tabIndex={open ? -1 : tabIndex}
      // Outline and ghost Buttons keep their hover fill while the menu is open.
      className={cn(
        "group/dropdown-menu-trigger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[input=pointer]:focus-visible:outline-0 data-[state=open]:data-[variant=ghost]:bg-accent data-[state=open]:data-[variant=outline]:bg-accent",
        className
      )}
      {...trackTriggerInput(lastInput, { onFocus, onBlur, onKeyDown })}
      {...props}
    />
  )
}

/** Muted chevron for a trigger button; it turns while the menu is open. */
function DropdownMenuChevron({
  className,
  ...props
}: React.ComponentProps<typeof ChevronDownIcon>) {
  return (
    <ChevronDownIcon
      data-slot="dropdown-menu-chevron"
      aria-hidden="true"
      className={cn(
        "size-4 text-muted-foreground group-data-[state=open]/dropdown-menu-trigger:rotate-180",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  onPointerMove,
  onKeyDown,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const { lastInput } = React.use(DropdownMenuContext)

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          panelClassName,
          "max-h-(--radix-dropdown-menu-content-available-height) min-w-48 origin-(--radix-dropdown-menu-content-transform-origin)",
          className
        )}
        {...trackInput(lastInput, onPointerMove, onKeyDown)}
        onCloseAutoFocus={(event) => {
          onCloseAutoFocus?.(event)
          forgetInput(lastInput)
        }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group
      data-slot="dropdown-menu-group"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      data-variant={variant}
      className={cn(
        itemClassName,
        "data-inset:pl-8",
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:[&>svg]:text-destructive",
        "data-[variant=destructive]:data-highlighted:bg-destructive data-[variant=destructive]:data-highlighted:text-destructive-foreground data-[variant=destructive]:data-highlighted:[&>svg]:text-destructive-foreground",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  closeOnSelect = false,
  onSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  /** By default the menu stays open so several options can be toggled. */
  closeOnSelect?: boolean
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(itemClassName, "pl-8", className)}
      checked={checked}
      onSelect={(event) => {
        onSelect?.(event)
        if (!closeOnSelect) event.preventDefault()
      }}
      {...props}
    >
      <span
        data-slot="dropdown-menu-item-indicator"
        className="pointer-events-none absolute left-2 flex size-4 items-center justify-center text-brand-cyan"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon aria-hidden="true" className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(itemClassName, "pl-8", className)}
      {...props}
    >
      <span
        data-slot="dropdown-menu-item-indicator"
        className="pointer-events-none absolute left-2 flex size-4 items-center justify-center"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="block size-2 rounded-full bg-brand-cyan" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs text-muted-foreground data-inset:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        // Muted text fails contrast on the accent fill, so it darkens there.
        "ml-auto pl-4 text-xs tracking-widest text-muted-foreground group-data-highlighted/dropdown-menu-item:text-foreground",
        "group-data-[variant=destructive]/dropdown-menu-item:group-data-highlighted/dropdown-menu-item:text-destructive-foreground",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        itemClassName,
        "data-inset:pl-8 data-[state=open]:bg-accent",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon aria-hidden="true" className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  sideOffset = -4,
  alignOffset = -5,
  onPointerMove,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const { lastInput } = React.use(DropdownMenuContext)

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
          panelClassName,
          "max-h-(--radix-dropdown-menu-content-available-height) min-w-44 origin-(--radix-dropdown-menu-content-transform-origin)",
          className
        )}
        {...trackInput(lastInput, onPointerMove, onKeyDown)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuChevron,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
