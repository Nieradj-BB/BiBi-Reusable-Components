import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArchiveIcon,
  ArrowUpDownIcon,
  Columns3Icon,
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  EyeIcon,
  FolderInputIcon,
  LogOutIcon,
  PencilIcon,
  PlusIcon,
  SettingsIcon,
  Trash2Icon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuChevron,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const meta = {
  title: "Components/Overlays/DropdownMenu",
  component: DropdownMenu,
  // Muted labels and shortcuts need the card surface for contrast.
  globals: { backgrounds: { value: "card" } },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

const body = within(document.body)

async function openMenu(trigger: HTMLElement, name: string) {
  await userEvent.click(trigger)
  return body.findByRole("menu", { name })
}

function ActionsTrigger({ className }: { className?: string }) {
  return (
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className={className}>
        Acties
        <DropdownMenuChevron />
      </Button>
    </DropdownMenuTrigger>
  )
}

export const Open: Story = {
  render: () => (
    <DropdownMenu>
      <ActionsTrigger />
      <DropdownMenuContent>
        <DropdownMenuItem>
          <PencilIcon aria-hidden="true" />
          Bewerken
          <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon aria-hidden="true" />
          Dupliceren
          <DropdownMenuShortcut>Ctrl+D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DownloadIcon aria-hidden="true" />
          Downloaden als pdf
          <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ArchiveIcon aria-hidden="true" />
          Archiveren
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Acties" })
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    // Enter opens the menu on the first item; arrows move, Escape closes.
    trigger.focus()
    await userEvent.keyboard("{Enter}")
    const menu = await body.findByRole("menu", { name: "Acties" })
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    const items = within(menu).getAllByRole("menuitem")
    await expect(items).toHaveLength(4)
    await waitFor(() => expect(items[0]).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}")
    await expect(items[1]).toHaveFocus()
    await expect(items[1]).toHaveAttribute("data-highlighted")

    // Typing a letter jumps to the matching item.
    await userEvent.keyboard("a")
    await expect(items[3]).toHaveFocus()

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull())
    await expect(trigger).toHaveFocus()

    // Selecting an item closes the menu.
    const reopened = await openMenu(trigger, "Acties")
    await userEvent.click(
      within(reopened).getByRole("menuitem", { name: /Dupliceren/ })
    )
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull())

    await openMenu(trigger, "Acties")
  },
}

export const LabelsAndSeparators: Story = {
  name: "Labels and separators",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <UserIcon aria-hidden="true" />
          Sanne Bakker
          <DropdownMenuChevron />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup aria-labelledby="dropdown-account-label">
          <DropdownMenuLabel id="dropdown-account-label">
            Mijn account
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon aria-hidden="true" />
            Profiel
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon aria-hidden="true" />
            Instellingen
            <DropdownMenuShortcut>Ctrl+,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup aria-labelledby="dropdown-team-label">
          <DropdownMenuLabel id="dropdown-team-label">Team</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserPlusIcon aria-hidden="true" />
            Teamlid uitnodigen
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" />
          Uitloggen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Sanne Bakker" })
    const menu = await openMenu(trigger, "Sanne Bakker")
    await expect(trigger).toHaveAttribute("data-state", "open")

    const account = within(menu).getByRole("group", { name: "Mijn account" })
    await expect(within(account).getAllByRole("menuitem")).toHaveLength(2)
    await expect(
      within(menu).getByRole("group", { name: "Team" })
    ).toBeInTheDocument()
    await expect(within(menu).getAllByRole("separator")).toHaveLength(2)
  },
}

const columns = ["Klant", "Projectnummer", "Status", "Bedrag", "Vervaldatum"]

function ColumnsMenu() {
  const [visible, setVisible] = React.useState<Record<string, boolean>>({
    Klant: true,
    Projectnummer: true,
    Status: true,
    Bedrag: false,
    Vervaldatum: true,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns3Icon aria-hidden="true" />
          Kolommen
          <DropdownMenuChevron />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Zichtbare kolommen</DropdownMenuLabel>
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            checked={visible[column]}
            onCheckedChange={(checked) =>
              setVisible((current) => ({ ...current, [column]: checked }))
            }
          >
            {column}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const CheckboxItems: Story = {
  name: "Checkbox items",
  render: () => <ColumnsMenu />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Kolommen" })
    const menu = await openMenu(trigger, "Kolommen")
    const amount = within(menu).getByRole("menuitemcheckbox", {
      name: "Bedrag",
    })
    await expect(amount).toHaveAttribute("aria-checked", "false")
    await expect(
      within(menu).getByRole("menuitemcheckbox", { name: "Klant" })
    ).toHaveAttribute("aria-checked", "true")

    // The menu stays open while toggling, so several columns can change.
    await userEvent.click(amount)
    await expect(amount).toHaveAttribute("aria-checked", "true")
    await expect(menu).toBeInTheDocument()
    await userEvent.click(amount)
    await expect(amount).toHaveAttribute("aria-checked", "false")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  },
}

const sortOptions = [
  "Nieuwste eerst",
  "Oudste eerst",
  "Hoogste bedrag",
  "Klant (A-Z)",
]

function SortMenu() {
  const [sort, setSort] = React.useState(sortOptions[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowUpDownIcon aria-hidden="true" />
          Sorteren
          <DropdownMenuChevron />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={setSort}
          aria-labelledby="dropdown-sort-label"
        >
          <DropdownMenuLabel id="dropdown-sort-label">
            Sorteren op
          </DropdownMenuLabel>
          {sortOptions.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const RadioItems: Story = {
  name: "Radio items",
  render: () => <SortMenu />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Sorteren" })
    const menu = await openMenu(trigger, "Sorteren")
    const group = within(menu).getByRole("group", { name: "Sorteren op" })
    await expect(
      within(group).getByRole("menuitemradio", { name: "Nieuwste eerst" })
    ).toHaveAttribute("aria-checked", "true")

    await userEvent.click(
      within(group).getByRole("menuitemradio", { name: "Oudste eerst" })
    )
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull())

    const reopened = await openMenu(trigger, "Sorteren")
    await expect(
      within(reopened).getByRole("menuitemradio", { name: "Oudste eerst" })
    ).toHaveAttribute("aria-checked", "true")
    await expect(
      within(reopened).getByRole("menuitemradio", { name: "Nieuwste eerst" })
    ).toHaveAttribute("aria-checked", "false")
  },
}

export const DestructiveItem: Story = {
  name: "Destructive item",
  render: () => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Acties voor factuur 2026-014"
          >
            <EllipsisIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <EyeIcon aria-hidden="true" />
            Bekijken
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PencilIcon aria-hidden="true" />
            Bewerken
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon aria-hidden="true" />
            Dupliceren
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon aria-hidden="true" />
            Verwijderen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", {
      name: "Acties voor factuur 2026-014",
    })
    const menu = await openMenu(trigger, "Acties voor factuur 2026-014")
    const remove = within(menu).getByRole("menuitem", { name: "Verwijderen" })
    await expect(remove).toHaveAttribute("data-variant", "destructive")

    await userEvent.hover(remove)
    await waitFor(() => expect(remove).toHaveAttribute("data-highlighted"))
    await expect(trigger).toHaveAttribute("data-state", "open")
  },
}

export const Submenu: Story = {
  render: () => (
    <DropdownMenu>
      <ActionsTrigger />
      <DropdownMenuContent>
        <DropdownMenuItem>
          <PencilIcon aria-hidden="true" />
          Bewerken
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FolderInputIcon aria-hidden="true" />
            Verplaatsen naar
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Project Noorderhaven</DropdownMenuItem>
            <DropdownMenuItem>Project Lindenpark</DropdownMenuItem>
            <DropdownMenuItem>Project Vijverhof</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PlusIcon aria-hidden="true" />
              Nieuw project…
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <CopyIcon aria-hidden="true" />
          Dupliceren
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ArchiveIcon aria-hidden="true" />
          Archiveren
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Acties" })
    trigger.focus()
    await userEvent.keyboard("{Enter}")
    const menu = await body.findByRole("menu", { name: "Acties" })
    const subTrigger = within(menu).getByRole("menuitem", {
      name: "Verplaatsen naar",
    })
    await expect(subTrigger).toHaveAttribute("aria-haspopup", "menu")

    await userEvent.keyboard("{ArrowDown}")
    await expect(subTrigger).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    const submenu = await body.findByRole("menu", { name: "Verplaatsen naar" })
    await expect(subTrigger).toHaveAttribute("aria-expanded", "true")
    await expect(subTrigger).toHaveAttribute("data-state", "open")
    await waitFor(() =>
      expect(
        within(submenu).getByRole("menuitem", { name: "Project Noorderhaven" })
      ).toHaveFocus()
    )

    // ArrowLeft closes the submenu and returns to its trigger.
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() =>
      expect(body.queryByRole("menu", { name: "Verplaatsen naar" })).toBeNull()
    )
    await expect(subTrigger).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    await body.findByRole("menu", { name: "Verplaatsen naar" })
  },
}

export const ItemStates: Story = {
  name: "Item states",
  render: () => (
    <DropdownMenu>
      <ActionsTrigger />
      <DropdownMenuContent>
        <DropdownMenuItem>
          <PencilIcon aria-hidden="true" />
          Bewerken
        </DropdownMenuItem>
        {/* Static previews of hover and keyboard focus. */}
        <DropdownMenuItem className="bg-accent">
          <CopyIcon aria-hidden="true" />
          Dupliceren
          <DropdownMenuShortcut className="text-foreground">
            Ctrl+D
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="outline-2 outline-offset-2 outline-ring">
          <DownloadIcon aria-hidden="true" />
          Downloaden
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <UserPlusIcon aria-hidden="true" />
          Versturen naar klant
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="bg-destructive data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:[&>svg]:text-destructive-foreground"
        >
          <Trash2Icon aria-hidden="true" />
          Verwijderen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Acties" })
    const menu = await openMenu(trigger, "Acties")
    const download = within(menu).getByRole("menuitem", { name: "Downloaden" })
    const send = within(menu).getByRole("menuitem", {
      name: "Versturen naar klant",
    })
    const remove = within(menu).getByRole("menuitem", { name: "Verwijderen" })
    await expect(send).toHaveAttribute("aria-disabled", "true")
    await expect(send).toHaveAttribute("data-disabled")

    // Hover highlights an item without the focus ring; the keyboard shows the
    // ring and skips the disabled item.
    await userEvent.hover(download)
    await waitFor(() => expect(download).toHaveFocus())
    await expect(download).toHaveAttribute("data-highlighted")
    await expect(getComputedStyle(download).outlineWidth).toBe("0px")
    await userEvent.keyboard("{ArrowDown}")
    await expect(remove).toHaveFocus()
    await expect(getComputedStyle(remove).outlineStyle).toBe("solid")
    await expect(getComputedStyle(remove).outlineWidth).toBe("2px")

    // Destructive hover: red fill, no ring.
    await userEvent.hover(remove)
    await expect(getComputedStyle(remove).outlineWidth).toBe("0px")
  },
}

function TriggerState({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
      <DropdownMenu>
        {children}
        <DropdownMenuContent>
          <DropdownMenuItem>
            <PencilIcon aria-hidden="true" />
            Bewerken
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArchiveIcon aria-hidden="true" />
            Archiveren
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span>{label}</span>
    </div>
  )
}

export const TriggerStates: Story = {
  name: "Trigger states",
  render: () => (
    // Static previews of hover, focus and open; real interaction looks the same.
    <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-4">
      <TriggerState label="Rest">
        <ActionsTrigger />
      </TriggerState>
      <TriggerState label="Hover">
        <ActionsTrigger className="bg-accent" />
      </TriggerState>
      <TriggerState label="Focus">
        <ActionsTrigger className="outline-2 outline-offset-2 outline-ring" />
      </TriggerState>
      <TriggerState label="Open">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-accent">
            Acties
            <DropdownMenuChevron className="rotate-180" />
          </Button>
        </DropdownMenuTrigger>
      </TriggerState>
      <TriggerState label="Icon, open">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="bg-accent"
            aria-label="Acties voor project Lindenpark"
          >
            <EllipsisIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
      </TriggerState>
    </div>
  ),
  play: async ({ canvas }) => {
    const [rest] = canvas.getAllByRole("button", { name: "Acties" })
    const accent = getComputedStyle(
      canvas.getByRole("button", { name: "Acties voor project Lindenpark" })
    ).backgroundColor
    await expect(getComputedStyle(rest).backgroundColor).not.toBe(accent)

    // While open, an outline trigger keeps the accent fill.
    await openMenu(rest, "Acties")
    await expect(rest).toHaveAttribute("data-state", "open")
    await waitFor(() =>
      expect(getComputedStyle(rest).backgroundColor).toBe(accent)
    )
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull())
    await expect(rest).toHaveFocus()
    await expect(rest).toHaveAttribute("aria-expanded", "false")
    rest.blur()
  },
}
