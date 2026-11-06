import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  DownloadIcon,
  EllipsisIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { expect, fn, userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Actions/Button",
  component: Button,
  args: { onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "navy", "outline", "ghost", "destructive"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: "Opslaan" },
  play: async ({ args, canvas }) => {
    const save = canvas.getByRole("button", { name: "Opslaan" })
    await userEvent.click(save)
    await expect(args.onClick).toHaveBeenCalledOnce()
    save.blur()
  },
}

export const Navy: Story = {
  args: { variant: "navy", children: "Offerte versturen" },
}

export const Outline: Story = {
  args: { variant: "outline", children: "Annuleren" },
}

export const Ghost: Story = {
  args: { variant: "ghost", children: "Filters wissen" },
}

export const Destructive: Story = {
  args: { variant: "destructive", children: "Factuur verwijderen" },
}

export const SizeDefault: Story = {
  name: "Size default",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>Opslaan</Button>
      <Button {...args} variant="outline">
        Annuleren
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const save = canvas.getByRole("button", { name: "Opslaan" })
    await expect(save.getBoundingClientRect().height).toBe(36)
  },
}

export const SizeSm: Story = {
  name: "Size sm",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} size="sm">
        Opslaan
      </Button>
      <Button {...args} size="sm" variant="outline">
        Annuleren
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const save = canvas.getByRole("button", { name: "Opslaan" })
    await expect(save.getBoundingClientRect().height).toBe(32)
  },
}

export const SizeLg: Story = {
  name: "Size lg",
  args: { size: "lg", children: "Project starten" },
  play: async ({ canvas }) => {
    const start = canvas.getByRole("button", { name: "Project starten" })
    await expect(start.getBoundingClientRect().height).toBe(44)
  },
}

export const SizeIcon: Story = {
  name: "Size icon",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} variant="outline" size="icon" aria-label="Bewerken">
        <PencilIcon aria-hidden="true" />
      </Button>
      <Button {...args} variant="ghost" size="icon" aria-label="Meer acties">
        <EllipsisIcon aria-hidden="true" />
      </Button>
      <Button {...args} variant="ghost" size="icon-sm" aria-label="Verwijderen">
        <Trash2Icon aria-hidden="true" />
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const edit = canvas.getByRole("button", { name: "Bewerken" })
    await expect(edit.getBoundingClientRect().width).toBe(36)
    const remove = canvas.getByRole("button", { name: "Verwijderen" })
    await expect(remove.getBoundingClientRect().width).toBe(32)
  },
}

export const WithIcon: Story = {
  name: "With icon",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>
        <PlusIcon aria-hidden="true" />
        Project toevoegen
      </Button>
      <Button {...args} variant="outline">
        <DownloadIcon aria-hidden="true" />
        Exporteren (CSV)
      </Button>
    </div>
  ),
}

// The hover fill is drawn with the hover classes so the state stays visible.
export const Hover: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} className="bg-brand-cyan/90">
        Opslaan
      </Button>
      <Button {...args} variant="outline" className="bg-accent">
        Annuleren
      </Button>
      <Button {...args} variant="ghost" className="bg-accent">
        Filters wissen
      </Button>
    </div>
  ),
}

export const Focus: Story = {
  args: { children: "Opslaan" },
  play: async ({ args, canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole("button", { name: "Opslaan" })).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard(" ")
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} disabled aria-describedby="button-disabled-reason">
        Factuur versturen
      </Button>
      <p id="button-disabled-reason" className="text-xs text-muted-foreground">
        Voeg eerst een factuurregel toe.
      </p>
    </div>
  ),
  play: async ({ args, canvas }) => {
    const send = canvas.getByRole("button", { name: "Factuur versturen" })
    await expect(send).toBeDisabled()
    await expect(send).toHaveAccessibleDescription(
      "Voeg eerst een factuurregel toe."
    )
    await userEvent.click(send, { pointerEventsCheck: 0 })
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Loading: Story = {
  args: { loading: true, children: "Opslaan…" },
  play: async ({ args, canvas }) => {
    const save = canvas.getByRole("button", { name: "Opslaan…" })
    await expect(save).toBeEnabled()
    await expect(save).toHaveAttribute("aria-busy", "true")
    await userEvent.click(save)
    await expect(save).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(args.onClick).not.toHaveBeenCalled()
    save.blur()
  },
}

export const ActionRow: Story = {
  name: "Action row",
  render: (args) => (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button {...args} variant="outline">
        Annuleren
      </Button>
      <Button {...args}>Opslaan</Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const [first, last] = canvas.getAllByRole("button")
    await expect(first).toHaveAccessibleName("Annuleren")
    await expect(last).toHaveAccessibleName("Opslaan")
  },
}
