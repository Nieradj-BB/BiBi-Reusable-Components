import type { Meta, StoryObj } from "@storybook/react-vite"
import { DownloadIcon } from "lucide-react"
import { expect, fn, userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const meta = {
  title: "Components/Feedback/Spinner",
  component: Spinner,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl rounded-xl border border-border bg-card p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: "select", options: ["sm", "default", "lg"] },
    label: { control: "text" },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

const onExport = fn()

export const SizeSm: Story = {
  name: "Size sm",
  args: { size: "sm" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("status")).toBeInTheDocument()
    await expect(canvas.getByText("Laden")).toHaveClass("sr-only")
    const icon = canvasElement.querySelector('[data-slot="spinner"] svg')
    await expect(icon).toHaveClass("size-3.5")
    await expect(icon).toHaveAttribute("aria-hidden", "true")
  },
}

export const SizeDefault: Story = {
  name: "Size default",
  args: {},
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Laden")
    const icon = canvasElement.querySelector('[data-slot="spinner"] svg')
    await expect(icon).toHaveClass("size-4")
    await expect(icon).toHaveClass("motion-safe:animate-spin")
  },
}

export const SizeLg: Story = {
  name: "Size lg",
  args: { size: "lg", label: "Projecten laden" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Projecten laden"
    )
    const icon = canvasElement.querySelector('[data-slot="spinner"] svg')
    await expect(icon).toHaveClass("size-6")
  },
}

export const InlineInText: Story = {
  name: "Inline in text",
  render: () => (
    <p
      role="status"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground"
    >
      <Spinner aria-hidden="true" />
      Facturen worden verwerkt…
    </p>
  ),
  play: async ({ canvas, canvasElement }) => {
    const status = canvas.getByRole("status")
    await expect(status).toHaveTextContent("Facturen worden verwerkt…")
    await expect(status).not.toHaveTextContent("Laden")
    const spinner = canvasElement.querySelector('[data-slot="spinner"]')
    await expect(spinner).toHaveAttribute("aria-hidden", "true")
    await expect(spinner).not.toHaveAttribute("role")
  },
}

export const InButton: Story = {
  name: "In button",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" loading onClick={onExport}>
        Exporteren…
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        loading
        aria-label="Document wordt gedownload"
      >
        <DownloadIcon aria-hidden="true" />
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const exportButton = canvas.getByRole("button", { name: "Exporteren…" })
    await expect(exportButton).toBeEnabled()
    await expect(exportButton).toHaveAttribute("aria-busy", "true")
    await userEvent.click(exportButton)
    await expect(onExport).not.toHaveBeenCalled()

    await expect(
      canvas.getByRole("button", { name: "Document wordt gedownload" })
    ).toHaveAttribute("aria-busy", "true")
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const Centred: Story = {
  render: () => (
    <div className="relative min-h-65 overflow-hidden rounded-xl border border-border bg-background">
      <div
        role="status"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground"
      >
        <Spinner size="lg" aria-hidden="true" />
        <span>Gegevens laden…</span>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Gegevens laden…"
    )
  },
}
