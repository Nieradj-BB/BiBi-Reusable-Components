import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Card as CardSurface } from "@/components/ui/card"
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton"

const meta = {
  title: "Components/Feedback/Skeleton",
  component: Skeleton,
  argTypes: {
    shape: {
      control: "select",
      options: ["text", "sm", "title", "value", "row", "circle"],
    },
    width: {
      control: "select",
      options: ["full", "90", "80", "75", "60", "40", "25"],
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const TextLines: Story = {
  name: "Text lines",
  render: () => (
    <SkeletonGroup label="Samenvatting laden…" className="max-w-sm">
      <CardSurface>
        <div className="flex flex-col gap-2 p-5">
          <Skeleton />
          <Skeleton width="90" />
          <Skeleton width="80" />
        </div>
      </CardSurface>
    </SkeletonGroup>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Samenvatting laden…"
    )
    const shapes = canvasElement.querySelectorAll("[data-slot=skeleton]")
    await expect(shapes).toHaveLength(3)
    for (const shape of shapes) {
      await expect(shape).toHaveAttribute("aria-hidden", "true")
      await expect(shape).toHaveClass("motion-safe:animate-pulse")
    }
  },
}

export const Card: Story = {
  render: () => (
    <SkeletonGroup label="Project laden…" className="max-w-sm">
      <CardSurface>
        <div className="flex flex-col gap-2 p-5">
          <div className="mb-2 flex items-center gap-3">
            <Skeleton shape="circle" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton shape="title" width="60" />
              <Skeleton shape="sm" width="40" />
            </div>
          </div>
          <Skeleton shape="sm" />
          <Skeleton shape="sm" width="75" />
        </div>
      </CardSurface>
    </SkeletonGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Project laden…")
  },
}

export const TableRows: Story = {
  name: "Table rows",
  render: () => (
    <SkeletonGroup label="Facturen laden…" className="max-w-sm">
      <CardSurface>
        <div className="flex flex-col gap-2 p-5">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} shape="row" />
          ))}
        </div>
      </CardSurface>
    </SkeletonGroup>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Facturen laden…"
    )
    await expect(
      canvasElement.querySelectorAll("[data-shape=row]")
    ).toHaveLength(4)
  },
}

export const StatTiles: Story = {
  name: "Stat tiles",
  render: () => (
    <SkeletonGroup
      label="Cijfers laden…"
      className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <CardSurface key={i} variant="elevated">
          <div className="flex flex-col gap-2 p-5">
            <Skeleton shape="sm" width="60" />
            <Skeleton shape="value" width="40" />
            <Skeleton shape="sm" width="75" />
          </div>
        </CardSurface>
      ))}
    </SkeletonGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Cijfers laden…")
  },
}
