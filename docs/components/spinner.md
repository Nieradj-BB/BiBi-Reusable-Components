# Spinner

A small rotating icon that tells people a short job is running: inline next to text, inside a control, or centred in a region whose content shape is not known yet.

## When to use

- A control or row action that is busy (saving, exporting, sending).
- A short status line for a job running in the background.
- A region or route that loads before its layout is known.

## When not to use

- Content with a known shape (tables, cards, lists): use Skeleton.
- Jobs that take longer than a few seconds and can report progress: show the progress in text.
- Covering a whole page or a filled form with a spinner.
- A busy Button: use its `loading` prop, which renders the same icon.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/spinner#v0.2.0
```

Also installs the `class-variance-authority` and `lucide-react` packages.

## Usage

```tsx
import { Spinner } from "@/components/ui/spinner"

// On its own: announces "Projecten laden" through role="status".
export function ProjectsLoading() {
  return <Spinner size="lg" label="Projecten laden" />
}

// With visible status text: the text carries the status, the icon is hidden.
export function InvoicesProcessing() {
  return (
    <p
      role="status"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground"
    >
      <Spinner aria-hidden="true" />
      Facturen worden verwerkt…
    </p>
  )
}

// Centred in a region while its layout is unknown.
export function RegionLoading() {
  return (
    <div className="relative min-h-65">
      <div
        role="status"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground"
      >
        <Spinner size="lg" aria-hidden="true" />
        <span>Gegevens laden…</span>
      </div>
    </div>
  )
}
```

For a busy button, use `Button`'s own `loading` prop: it shows the same icon in place of the leading icon, sets `aria-busy` and keeps the button enabled and focused while ignoring repeat clicks.

```tsx
<Button variant="outline" loading={exporting}>
  {exporting ? "Exporteren…" : "Exporteren"}
</Button>
```

## Props

| Prop          | Type                           | Default     | Notes                                                                         |
| ------------- | ------------------------------ | ----------- | ----------------------------------------------------------------------------- |
| `size`        | `"sm" \| "default" \| "lg"`    | `"default"` | Icon size: 14, 16 or 24px.                                                    |
| `label`       | `string`                       | `"Laden"`   | Screen-reader text; name what is loading where you can.                       |
| `aria-hidden` | `boolean`                      |             | Set when visible text already says what is loading: drops the role and label. |
| `role`        | `React.AriaRole`               | `"status"`  | Omitted when `aria-hidden` is set.                                            |
| `className`   | `string`                       |             | Merged with `cn()` on the wrapper `<span>`.                                   |
| ...           | `React.ComponentProps<"span">` |             | Passed to the wrapper `<span>`.                                               |

`spinnerVariants({ size })` returns the icon classes (size and spin).

## Variants and states

The lucide `Loader2Icon` in `currentColor`, rotating once per second.

| Size      | Icon | Use for                                      |
| --------- | ---- | -------------------------------------------- |
| `sm`      | 14px | Next to 12px text, in badges and dense cells |
| `default` | 16px | Next to 14px text and inside controls        |
| `lg`      | 24px | Only on its own, centred in a region         |

Under `prefers-reduced-motion` the icon stands still; the label still announces loading.

## Accessibility

- On its own the spinner has `role="status"` and a visually hidden label ("Laden", or what is loading).
- With visible status text, put `role="status"` on the text and `aria-hidden` on the spinner, so the text is announced once.
- Inside a button the spinner is hidden and the button text changes ("Exporteren…"); an icon-only button changes its `aria-label` instead.
- The spinner inherits `currentColor`, so it meets the contrast of the text it sits next to.
