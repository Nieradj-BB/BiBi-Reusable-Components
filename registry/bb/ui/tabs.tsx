"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot, Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva("group/tabs-list flex flex-wrap gap-1", {
  variants: {
    variant: {
      underline: "border-b border-border",
      pill: "",
    },
  },
  defaultVariants: {
    variant: "underline",
  },
})

const tabsTriggerClassName = cn(
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md bg-transparent px-3 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-50 *:data-[slot=badge]:tabular-nums [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "group-data-[variant=underline]/tabs-list:-mb-px group-data-[variant=underline]/tabs-list:rounded-b-none group-data-[variant=underline]/tabs-list:border-b-2 group-data-[variant=underline]/tabs-list:border-transparent",
  "aria-[current=page]:text-brand-cyan group-data-[variant=underline]/tabs-list:aria-[current=page]:border-brand-cyan data-[state=active]:text-brand-cyan group-data-[variant=underline]/tabs-list:data-[state=active]:border-brand-cyan",
  "group-data-[variant=pill]/tabs-list:aria-[current=page]:bg-brand-ice group-data-[variant=pill]/tabs-list:data-[state=active]:bg-brand-ice"
)

function TabsList({
  className,
  variant = "underline",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerClassName, className)}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 rounded-md pt-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

// Route tabs: links in a <nav> with aria-current="page", not ARIA tabs.
function TabsNav({
  className,
  variant = "pill",
  children,
  ...props
}: React.ComponentProps<"nav"> & VariantProps<typeof tabsListVariants>) {
  return (
    <nav data-slot="tabs-nav" className={cn("flex", className)} {...props}>
      <div
        data-slot="tabs-list"
        data-variant={variant}
        className={tabsListVariants({ variant })}
      >
        {children}
      </div>
    </nav>
  )
}

function TabsLink({
  className,
  active = false,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { active?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="tabs-link"
      aria-current={active ? "page" : undefined}
      className={cn(tabsTriggerClassName, className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsNav,
  TabsLink,
  tabsListVariants,
}
