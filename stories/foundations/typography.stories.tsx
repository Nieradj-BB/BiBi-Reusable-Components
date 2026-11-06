import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"
import { expect } from "storybook/test"

type Style = {
  role: string
  classes: string
  size: string
  weight: number
  note: string
  sample: ReactNode
}

const scale: Style[] = [
  {
    role: "Page title",
    classes: "text-3xl font-heading font-extrabold text-primary",
    size: "30px / 36px",
    weight: 800,
    note: "h1, one per page. Weight, colour and -0.01em letter-spacing come from the base heading style.",
    sample: <h1 className="text-3xl">Projecten</h1>,
  },
  {
    role: "Page subtitle",
    classes: "text-base text-muted-foreground",
    size: "16px / 24px",
    weight: 400,
    note: "Directly under the page title (mt-1).",
    sample: (
      <p className="text-base text-muted-foreground">
        Alle lopende projecten, klanten en documenten op één plek
      </p>
    ),
  },
  {
    role: "Section title",
    classes: "text-xl font-heading font-extrabold text-primary",
    size: "20px / 28px",
    weight: 800,
    note: "h2; font, weight, colour and letter-spacing come from the base heading style.",
    sample: <h2 className="text-xl">Openstaande facturen</h2>,
  },
  {
    role: "Card title",
    classes: "text-base font-heading font-extrabold text-primary",
    size: "16px / 24px",
    weight: 800,
    note: "h3; font, weight, colour and letter-spacing come from the base heading style.",
    sample: <h3 className="text-base">Omzet per kwartaal</h3>,
  },
  {
    role: "Dialog title",
    classes: "text-lg/snug font-heading font-extrabold text-primary",
    size: "18px / 24.75px",
    weight: 800,
    note: "h2 inside the dialog; the base heading style sets the rest.",
    sample: <h2 className="text-lg/snug">Project archiveren?</h2>,
  },
  {
    role: "Panel title",
    classes: "text-2xl/tight font-heading font-extrabold text-primary",
    size: "24px / 30px",
    weight: 800,
    note: "h2 at the top of a side panel (sheet); the base heading style sets the rest.",
    sample: <h2 className="text-2xl/tight">Factuur 2026-0142</h2>,
  },
  {
    role: "Body",
    classes: "text-sm text-foreground",
    size: "14px / 20px",
    weight: 400,
    note: "Default UI text. Longer explanatory paragraphs add leading-relaxed (22.75px).",
    sample: (
      <p className="text-sm text-foreground">
        De offerte voor Van Dijk Bouw is verstuurd en wacht op akkoord.
      </p>
    ),
  },
  {
    role: "Description",
    classes: "text-sm text-muted-foreground",
    size: "14px / 20px",
    weight: 400,
    note: "Under section, card and dialog titles (mt-1).",
    sample: (
      <p className="text-sm text-muted-foreground">
        Facturen die langer dan 30 dagen openstaan.
      </p>
    ),
  },
  {
    role: "Small / meta",
    classes: "text-xs text-muted-foreground",
    size: "12px / 16px",
    weight: 400,
    note: "Meta, help text and captions; 12px is the smallest size.",
    sample: (
      <p className="text-xs text-muted-foreground">
        Bijgewerkt op 3 november 2026 door Sanne de Vries
      </p>
    ),
  },
  {
    role: "Label",
    classes: "text-sm font-semibold text-primary",
    size: "14px / 20px",
    weight: 600,
    note: "Field labels, as a block above the control.",
    sample: <p className="text-sm font-semibold text-primary">Projectnaam</p>,
  },
  {
    role: "Eyebrow",
    classes: "text-xs font-bold uppercase tracking-widest text-brand-cyan",
    size: "12px / 16px",
    weight: 700,
    note: "Small label above a content group. 3.25:1 on card: accepted brand-colour failure (decision 5).",
    sample: (
      <p className="text-xs font-bold tracking-widest text-brand-cyan uppercase">
        Recente documenten
      </p>
    ),
  },
  {
    role: "KPI number",
    classes: "font-heading text-3xl font-bold text-primary",
    size: "30px / 36px",
    weight: 700,
    note: "Proportional figures (no tabular-nums); its label sits above in text-sm text-muted-foreground.",
    sample: (
      <p className="font-heading text-3xl font-bold text-primary">1.284</p>
    ),
  },
  {
    role: "Empty-state title",
    classes: "font-heading text-lg font-bold text-primary",
    size: "18px / 28px",
    weight: 700,
    note: "A p, not a heading, centred in an empty state.",
    sample: (
      <p className="font-heading text-lg font-bold text-primary">
        Nog geen documenten
      </p>
    ),
  },
  {
    role: "Table header",
    classes:
      "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
    size: "12px / 16px",
    weight: 600,
    note: "The header row sits on card (4.76:1), not on muted (4.37:1).",
    sample: (
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        Klant
      </p>
    ),
  },
]

function TypeScale() {
  return (
    <div className="flex max-w-6xl flex-col gap-8">
      <div className="flex max-w-3xl flex-col gap-1">
        <p className="text-sm text-foreground">
          Figtree, self-hosted as a variable font through
          @fontsource-variable/figtree. Weights: 400 body, 500 buttons and
          badges, 600 labels and table headers, 700 KPI numbers, empty-state
          titles and emphasis, 800 headings.
        </p>
        <p className="text-sm text-muted-foreground">
          h1 to h3 get weight 800, the primary colour and -0.01em letter-spacing
          from the base style: set only the size at the call site.
        </p>
      </div>
      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {scale.map((style) => (
          <li
            key={style.role}
            data-role={style.role}
            className="grid gap-4 p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
          >
            <div data-sample>{style.sample}</div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-primary">{style.role}</p>
              <p className="text-xs text-muted-foreground">
                {style.size} · weight {style.weight}
              </p>
              <p className="text-xs text-foreground">{style.classes}</p>
              <p className="text-xs text-muted-foreground">{style.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const meta = {
  title: "Foundations/Typography",
  component: TypeScale,
} satisfies Meta<typeof TypeScale>

export default meta

type Story = StoryObj<typeof meta>

export const Scale: Story = {
  play: async ({ canvas }) => {
    const title = canvas.getByRole("heading", { level: 1, name: "Projecten" })
    const style = getComputedStyle(title)
    await expect(style.fontFamily).toContain("Figtree Variable")
    await expect(style.fontWeight).toBe("800")
    await expect(style.fontSize).toBe("30px")
    await expect(style.letterSpacing).toBe("-0.3px")
  },
}
