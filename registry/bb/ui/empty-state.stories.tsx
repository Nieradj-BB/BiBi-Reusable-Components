import type { Meta, StoryObj } from "@storybook/react-vite"
import { FolderIcon, PlusIcon } from "lucide-react"
import { expect, fn, userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

const meta = {
  title: "Components/Feedback/EmptyState",
  component: EmptyState,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

const onCreate = fn()
const onClearFilters = fn()
const onAddMember = fn()

export const Default: Story = {
  args: {
    icon: FolderIcon,
    title: "Nog geen projecten",
    description:
      "Maak een project aan om uren, documenten en facturen bij elkaar te houden.",
    action: (
      <Button onClick={onCreate}>
        <PlusIcon aria-hidden="true" />
        Nieuw project
      </Button>
    ),
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Nog geen projecten")).toBeVisible()
    const icon = canvasElement.querySelector('[data-slot="empty-state-icon"]')
    await expect(icon).toHaveAttribute("aria-hidden", "true")
    await userEvent.click(canvas.getByRole("button", { name: "Nieuw project" }))
    await expect(onCreate).toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const TitleAndText: Story = {
  name: "Title and text",
  args: {
    title: "Nog geen documenten",
    description:
      "Documenten die je aan dit project toevoegt, komen hier te staan.",
  },
}

export const NoResultsForFilter: Story = {
  name: "No results for filter",
  args: {
    size: "compact",
    description: "Geen facturen die bij deze filters passen.",
    action: (
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        Filters wissen
      </Button>
    ),
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Filters wissen" })
    )
    await expect(onClearFilters).toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const Compact: Story = {
  args: {
    size: "compact",
    description: "Geen teamleden gevonden met “visser”.",
  },
}

export const Inline: Story = {
  args: {
    size: "inline",
    description: "Nog geen teamleden in dit project.",
    action: (
      <Button variant="outline" size="sm" onClick={onAddMember}>
        <PlusIcon aria-hidden="true" />
        Teamlid toevoegen
      </Button>
    ),
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Teamlid toevoegen" })
    )
    await expect(onAddMember).toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
