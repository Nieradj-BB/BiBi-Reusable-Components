"use client"

import * as React from "react"
import { LogOutIcon, MenuIcon, XIcon, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type AppShellNavItem = {
  label: string
  icon: LucideIcon
  /** Renders a link. Without `href` the item is a button (e.g. to open a dialog). */
  href?: string
  /** Marks the current page (`aria-current="page"`). */
  active?: boolean
  count?: number
  /** Screen-reader text after the count. */
  countLabel?: string
  /** Button items: runs on click. */
  onSelect?: () => void
  /** Button items that open a dialog: its open state (`aria-expanded`). */
  dialogOpen?: boolean
}

type AppShellLinkProps = React.ComponentProps<"a"> & {
  href: string
  "data-slot"?: string
}

type AppShellUser = {
  name: string
  /** Defaults to the first letters of the first and last word of `name`. */
  initials?: string
}

function defaultRenderLink({ href, children, ...props }: AppShellLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  const first = words[0].charAt(0)
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ""
  return (first + last).toUpperCase()
}

function useIsBelow(breakpoint: number) {
  const query = `(max-width: ${breakpoint - 0.02}px)`
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query]
  )
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}

const navItemClassName =
  "flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground no-underline transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-expanded:bg-brand-ice aria-expanded:text-brand-cyan aria-[current=page]:bg-brand-ice aria-[current=page]:text-brand-cyan [&_svg:not([class*='size-'])]:size-5 [&>svg]:shrink-0"

function AppShellBrand({
  appName,
  bar = false,
}: {
  appName: string
  bar?: boolean
}) {
  return (
    <div
      data-slot="app-shell-brand"
      className={cn(
        "block font-heading font-extrabold text-primary",
        bar ? "text-base" : "border-b border-border p-6 text-lg"
      )}
    >
      Blue Bricks <span className="text-brand-cyan">{appName}</span>
    </div>
  )
}

function AppShellNav({
  items,
  label,
  renderLink,
  onNavigate,
}: {
  items: AppShellNavItem[]
  label: string
  renderLink: (props: AppShellLinkProps) => React.ReactNode
  onNavigate?: () => void
}) {
  return (
    <nav
      data-slot="app-shell-nav"
      aria-label={label}
      className="flex flex-col gap-1 p-3"
    >
      {items.map((item) => {
        const Icon = item.icon
        const content = (
          <>
            <Icon aria-hidden="true" />
            {item.label}
            {item.count !== undefined && (
              <Badge variant="secondary" count className="ml-auto">
                {item.count}
                {item.countLabel !== "" && (
                  <>
                    {" "}
                    <span className="sr-only">
                      {item.countLabel ?? "nieuw"}
                    </span>
                  </>
                )}
              </Badge>
            )}
          </>
        )

        if (item.href !== undefined) {
          return (
            <React.Fragment key={item.label}>
              {renderLink({
                href: item.href,
                "aria-current": item.active ? "page" : undefined,
                className: navItemClassName,
                onClick: onNavigate,
                children: content,
                "data-slot": "app-shell-nav-item",
              })}
            </React.Fragment>
          )
        }

        return (
          <button
            key={item.label}
            type="button"
            data-slot="app-shell-nav-item"
            aria-haspopup={item.dialogOpen !== undefined ? "dialog" : undefined}
            aria-expanded={item.dialogOpen}
            aria-current={item.active ? "page" : undefined}
            className={navItemClassName}
            onClick={() => {
              onNavigate?.()
              item.onSelect?.()
            }}
          >
            {content}
          </button>
        )
      })}
    </nav>
  )
}

function AppShellUserFooter({
  user,
  onSignOut,
  signOutLabel,
}: {
  user: AppShellUser
  onSignOut?: () => void
  signOutLabel: string
}) {
  return (
    <div
      data-slot="app-shell-user"
      className="flex items-center gap-3 border-t border-border p-4"
    >
      <span
        aria-hidden="true"
        className="inline-grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs/none font-semibold text-primary-foreground select-none"
      >
        {user.initials ?? getInitials(user.name)}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">{user.name}</span>
      {onSignOut && (
        <button
          type="button"
          data-slot="app-shell-sign-out"
          aria-label={signOutLabel}
          className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={onSignOut}
        >
          <LogOutIcon aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  )
}

function AppShell({
  appName,
  navItems,
  user,
  onSignOut,
  renderLink = defaultRenderLink,
  detailPanel,
  mobileBreakpoint = 768,
  navLabel = "Hoofdmenu",
  skipLinkLabel = "Naar de inhoud",
  menuLabel = "Menu",
  closeMenuLabel = "Menu sluiten",
  signOutLabel = "Uitloggen",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Shown in cyan after "Blue Bricks". */
  appName: string
  navItems: AppShellNavItem[]
  user: AppShellUser
  onSignOut?: () => void
  /** Renders nav links, e.g. with the app's router `Link`. Defaults to `<a>`. */
  renderLink?: (props: AppShellLinkProps) => React.ReactNode
  /** Rendered after the content area, e.g. a `<Sheet>` with details. */
  detailPanel?: React.ReactNode
  /** Below this width (px) the sidebar becomes a top bar with a menu. */
  mobileBreakpoint?: number
  navLabel?: string
  skipLinkLabel?: string
  menuLabel?: string
  closeMenuLabel?: string
  signOutLabel?: string
}) {
  const isMobile = useIsBelow(mobileBreakpoint)
  const [menuOpen, setMenuOpen] = React.useState(false)
  // The menu sheet only exists below the breakpoint; close it when leaving.
  if (!isMobile && menuOpen) setMenuOpen(false)
  const mainId = React.useId()
  const mainRef = React.useRef<HTMLElement>(null)

  const brand = <AppShellBrand appName={appName} bar={isMobile} />
  const userFooter = (
    <AppShellUserFooter
      user={user}
      onSignOut={onSignOut}
      signOutLabel={signOutLabel}
    />
  )

  return (
    <div
      data-slot="app-shell"
      data-layout={isMobile ? "mobile" : "desktop"}
      className={cn(
        "relative flex h-svh overflow-hidden bg-background text-foreground",
        isMobile && "flex-col",
        className
      )}
      {...props}
    >
      <a
        data-slot="app-shell-skip-link"
        href={`#${mainId}`}
        className="absolute top-3 left-3 z-50 rounded-md bg-brand-cyan px-3 py-2 text-sm font-medium text-brand-cyan-foreground no-underline not-focus:sr-only focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={(event) => {
          event.preventDefault()
          mainRef.current?.focus()
        }}
      >
        {skipLinkLabel}
      </a>
      {isMobile ? (
        <Sheet modal open={menuOpen} onOpenChange={setMenuOpen}>
          <header
            data-slot="app-shell-topbar"
            className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card pr-4 pl-2"
          >
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={menuLabel}>
                <MenuIcon aria-hidden="true" />
              </Button>
            </SheetTrigger>
            {brand}
          </header>
          <SheetContent
            side="left"
            showCloseButton={false}
            aria-describedby={undefined}
            className="justify-between"
          >
            <SheetTitle className="sr-only">{menuLabel}</SheetTitle>
            <div className="min-h-0 overflow-y-auto">
              <div className="flex h-14 items-center justify-between gap-2 border-b border-border pr-2 pl-6">
                {brand}
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={closeMenuLabel}
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                </SheetClose>
              </div>
              <AppShellNav
                items={navItems}
                label={navLabel}
                renderLink={renderLink}
                onNavigate={() => setMenuOpen(false)}
              />
            </div>
            {userFooter}
          </SheetContent>
        </Sheet>
      ) : (
        <div
          data-slot="app-shell-sidebar"
          className="flex w-62.5 shrink-0 flex-col justify-between border-r border-border bg-card"
        >
          <div className="min-h-0 overflow-y-auto">
            {brand}
            <AppShellNav
              items={navItems}
              label={navLabel}
              renderLink={renderLink}
            />
          </div>
          {userFooter}
        </div>
      )}
      <main
        ref={mainRef}
        id={mainId}
        tabIndex={-1}
        data-slot="app-shell-main"
        className="min-w-0 flex-1 overflow-y-auto focus:outline-none"
      >
        {children}
      </main>
      {detailPanel}
    </div>
  )
}

export {
  AppShell,
  type AppShellLinkProps,
  type AppShellNavItem,
  type AppShellUser,
}
