import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Building2Icon,
  CircleHelpIcon,
  FileTextIcon,
  FolderIcon,
  PlusIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react"
import { expect, fn, waitFor, within } from "storybook/test"

import {
  AppShell,
  type AppShellNavItem,
} from "@/components/app-shell/app-shell"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/ui/page-header"

const navItems: AppShellNavItem[] = [
  { label: "Projecten", href: "#projecten", icon: FolderIcon, active: true },
  { label: "Klanten", href: "#klanten", icon: Building2Icon },
  { label: "Documenten", href: "#documenten", icon: FileTextIcon, count: 3 },
  { label: "Facturen", href: "#facturen", icon: ReceiptIcon },
  { label: "Team", href: "#team", icon: UsersIcon },
]

function DemoShell({
  withAction = true,
  ...props
}: Omit<React.ComponentProps<typeof AppShell>, "navItems"> & {
  withAction?: boolean
}) {
  const [helpOpen, setHelpOpen] = React.useState(false)

  return (
    <>
      <AppShell
        navItems={[
          ...navItems,
          {
            label: "Help",
            icon: CircleHelpIcon,
            dialogOpen: helpOpen,
            onSelect: () => setHelpOpen(true),
          },
        ]}
        // Stand-in for a router link: navigates without a page load.
        renderLink={({ href, onClick, children, ...linkProps }) => (
          <a
            href={href}
            {...linkProps}
            onClick={(event) => {
              event.preventDefault()
              onClick?.(event)
            }}
          >
            {children}
          </a>
        )}
        {...props}
      >
        <PageHeader
          title="Projecten"
          subtitle="Alle lopende en afgeronde projecten van je team"
          actions={
            withAction && (
              <Button>
                <PlusIcon aria-hidden="true" />
                Nieuw project
              </Button>
            )
          }
        />
        <div
          aria-hidden="true"
          className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-6"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-24 rounded-xl border border-border bg-card shadow-tile"
            />
          ))}
        </div>
      </AppShell>
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Help</DialogTitle>
            <DialogDescription>
              Antwoorden op veelgestelde vragen
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm">
              Neem contact op met de beheerder van je team.
            </p>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  )
}

const meta = {
  title: "Components/Navigation & layout/AppShell",
  component: DemoShell,
  parameters: { layout: "fullscreen" },
  args: {
    appName: "Projecten",
    user: { name: "Sanne de Vries" },
    onSignOut: fn(),
    className: "h-130",
  },
} satisfies Meta<typeof DemoShell>

export default meta
type Story = StoryObj<typeof meta>

const mobile = { viewport: { value: "mobile2", isRotated: false } }

export const Desktop: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Hoofdmenu" })
    await expect(nav).toBeVisible()
    await expect(canvas.getByRole("main")).toBeVisible()
    await expect(
      within(nav).getByRole("link", { name: "Projecten" })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      canvas.queryByRole("button", { name: "Menu" })
    ).not.toBeInTheDocument()
    await expect(canvas.getByText("SV")).toHaveAttribute("aria-hidden", "true")
  },
}

export const NavStates: Story = {
  name: "Nav states",
  play: async ({ args, canvas, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Hoofdmenu" })
    await expect(
      within(nav).getByRole("link", { name: "Klanten" })
    ).not.toHaveAttribute("aria-current")

    // Skip link, Projecten, Klanten, Documenten.
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    const documenten = within(nav).getByRole("link", {
      name: "Documenten 3 nieuw",
    })
    await expect(documenten).toHaveFocus()
    await expect(getComputedStyle(documenten).outlineStyle).toBe("solid")

    const help = within(nav).getByRole("button", { name: "Help" })
    await expect(help).toHaveAttribute("aria-haspopup", "dialog")
    await expect(help).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(help)
    const body = within(document.body)
    await expect(
      await body.findByRole("dialog", { name: "Help" })
    ).toBeVisible()
    await expect(help).toHaveAttribute("aria-expanded", "true")
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(body.queryByRole("dialog", { name: "Help" })).toBeNull()
    )
    await expect(help).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(canvas.getByRole("button", { name: "Uitloggen" }))
    await expect(args.onSignOut).toHaveBeenCalledOnce()
    canvas.getByRole("button", { name: "Uitloggen" }).blur()
  },
}

export const SkipLink: Story = {
  name: "Skip link",
  play: async ({ canvas, userEvent }) => {
    const skipLink = canvas.getByRole("link", { name: "Naar de inhoud" })
    await userEvent.tab()
    await expect(skipLink).toHaveFocus()
    await expect(skipLink.getBoundingClientRect().width).toBeGreaterThan(24)
    await expect(getComputedStyle(skipLink).outlineStyle).toBe("solid")

    await userEvent.keyboard("{Enter}")
    await expect(canvas.getByRole("main")).toHaveFocus()
    await expect(skipLink.getBoundingClientRect().width).toBeLessThanOrEqual(1)

    // End on the focused look.
    skipLink.focus()
  },
}

export const Mobile: Story = {
  globals: mobile,
  args: { withAction: false },
  play: async ({ canvas }) => {
    const menu = canvas.getByRole("button", { name: "Menu" })
    await expect(menu).toBeVisible()
    await expect(menu).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.getByRole("banner")).toBeVisible()
    await expect(
      canvas.queryByRole("navigation", { name: "Hoofdmenu" })
    ).not.toBeInTheDocument()
  },
}

export const MobileMenuOpen: Story = {
  name: "Mobile menu open",
  globals: mobile,
  args: { withAction: false },
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const menu = canvas.getByRole("button", { name: "Menu" })

    await userEvent.click(menu)
    let sheet = await body.findByRole("dialog", { name: "Menu" })
    await expect(sheet).toBeVisible()
    await expect(menu).toHaveAttribute("aria-expanded", "true")
    await expect(menu).toHaveAttribute("aria-controls", sheet.id)

    await userEvent.click(
      within(sheet).getByRole("button", { name: "Menu sluiten" })
    )
    await waitFor(() =>
      expect(body.queryByRole("dialog", { name: "Menu" })).toBeNull()
    )
    await expect(menu).toHaveFocus()

    // Keyboard: focus moves into the sheet, stays trapped, Escape closes it.
    await userEvent.keyboard("{Enter}")
    sheet = await body.findByRole("dialog", { name: "Menu" })
    await waitFor(() =>
      expect(sheet).toContainElement(
        document.activeElement as HTMLElement | null
      )
    )
    for (let index = 0; index < 10; index++) await userEvent.tab()
    await expect(sheet).toContainElement(
      document.activeElement as HTMLElement | null
    )
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(body.queryByRole("dialog", { name: "Menu" })).toBeNull()
    )
    await expect(menu).toHaveFocus()
    await expect(menu).toHaveAttribute("aria-expanded", "false")

    // Choosing a destination closes the menu.
    await userEvent.click(menu)
    sheet = await body.findByRole("dialog", { name: "Menu" })
    await userEvent.click(within(sheet).getByRole("link", { name: "Klanten" }))
    await waitFor(() =>
      expect(body.queryByRole("dialog", { name: "Menu" })).toBeNull()
    )

    await userEvent.click(menu)
    sheet = await body.findByRole("dialog", { name: "Menu" })
    const nav = within(sheet).getByRole("navigation", { name: "Hoofdmenu" })
    await expect(
      within(nav).getByRole("link", { name: "Projecten" })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      within(sheet).getByRole("button", { name: "Uitloggen" })
    ).toBeVisible()
  },
}
