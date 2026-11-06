import type { Meta, StoryObj } from "@storybook/react-vite"
import { Check, CircleAlert, Clock } from "lucide-react"
import { expect } from "storybook/test"

import { Badge } from "@/components/ui/badge"

const meta = {
  title: "Components/Data display/Badge",
  component: Badge,
  // Badges sit on card and table surfaces: destructive text needs the white
  // surface for 4.5:1 contrast.
  decorators: [
    (Story) => (
      <div className="w-fit rounded-xl border border-border bg-card p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "success",
        "destructive",
        "brand",
      ],
    },
    count: { control: "boolean" },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: "default", children: "Projectleider" },
}

export const Secondary: Story = {
  args: { variant: "secondary", children: "In behandeling" },
  play: async ({ canvas }) => {
    const badge = canvas.getByText("In behandeling")
    await expect(badge).toHaveAttribute("data-variant", "secondary")
  },
}

export const Outline: Story = {
  args: { variant: "outline", children: "Gearchiveerd" },
}

export const Success: Story = {
  args: {
    variant: "success",
    children: (
      <>
        <Check aria-hidden="true" />
        Betaald
      </>
    ),
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <CircleAlert aria-hidden="true" />
        Verlopen
      </>
    ),
  },
}

export const Brand: Story = {
  args: { variant: "brand", children: "Nieuw" },
}

export const WithIcon: Story = {
  name: "With icon",
  args: {
    variant: "secondary",
    children: (
      <>
        <Clock aria-hidden="true" />
        Wacht op akkoord
      </>
    ),
  },
}

export const Count: Story = {
  args: { variant: "secondary", count: true },
  render: (args) => (
    <p>
      <span>Facturen</span>{" "}
      <Badge {...args}>
        3 <span className="sr-only">nieuw</span>
      </Badge>
    </p>
  ),
  play: async ({ canvas }) => {
    const badge = canvas.getByText("nieuw").parentElement
    await expect(badge).toHaveTextContent("3 nieuw")
    await expect(badge).toHaveClass("tabular-nums")
  },
}
