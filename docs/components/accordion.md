# Accordion

Collapsible sections with a title and a chevron that hide secondary content; one or several can be open at a time.

## When to use

- Secondary detail people only sometimes need, such as all the values behind a chart or how a figure is counted.
- A list of items with optional detail per item (`variant="item"`), for example inside a card.

## When not to use

- Content most people need: show it directly.
- Switching between views of the same content: use Tabs.
- A single show-more toggle inside running text.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/accordion#v0.2.0
```

## Usage

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function BillingFaq() {
  return (
    <Accordion type="multiple" defaultValue={["billing"]}>
      <AccordionItem value="billing">
        <AccordionTrigger>Facturatie</AccordionTrigger>
        <AccordionContent>
          <p>Facturen gaan op de eerste werkdag van de maand de deur uit.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="terms">
        <AccordionTrigger>Betaaltermijn</AccordionTrigger>
        <AccordionContent>
          <div>
            <p className="mb-1 font-semibold text-primary">Standaard</p>
            <p>Klanten betalen binnen 30 dagen na de factuurdatum.</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

Item list inside a card, with a second line per item and the triggers one heading level below the card title:

```tsx
<Accordion variant="item" defaultValue="portal">
  <AccordionItem value="portal">
    <AccordionTrigger
      headingLevel={4}
      meta="Hofstede Advies · loopt tot maart 2027"
    >
      Klantportaal
    </AccordionTrigger>
    <AccordionContent>
      <p>De eerste versie staat klaar voor de acceptatietest.</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## Props

The parts follow shadcn/ui and Radix Accordion: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`.

| Part / prop                          | Type                                      | Default           | Notes                                                                                |
| ------------------------------------ | ----------------------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `Accordion` `type`                   | `"single" \| "multiple"`                  | `"single"`        | `single`: opening a section closes the open one. `multiple`: each opens on its own.  |
| `Accordion` `collapsible`            | `boolean`                                 | `true`            | `single` only: the open section can be closed again.                                 |
| `Accordion` `value` / `defaultValue` | `string` (single) / `string[]` (multiple) | none (all closed) | Controlled or initial open sections, with `onValueChange`.                           |
| `Accordion` `variant`                | `"card" \| "item"`                        | `"card"`          | `card`: each section is a bordered card. `item`: compact tinted rows for item lists. |
| `AccordionItem` `value`              | `string`                                  |                   | Required. `disabled` makes the section unavailable.                                  |
| `AccordionTrigger` `meta`            | `ReactNode`                               |                   | Small muted second line under the title (meant for the `item` variant).              |
| `AccordionTrigger` `headingLevel`    | `2 \| 3 \| 4 \| 5 \| 6`                   | `3`               | The heading element around the trigger; pick the level that fits the page.           |
| `className`                          | `string`                                  |                   | Merged with `cn()`. On `AccordionContent` it goes on the padded body inside.         |

## Variants and states

Sections stack with 8px between them. The chevron sits before the title and turns 90° when the section opens (no transition under reduced motion).

| Variant | Look                                                                                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `card`  | White card, 1px border, 12px radius. Trigger 16px semibold navy with 20px by 16px padding; body 14px text with 20px side and bottom padding and 12px between blocks.                                          |
| `item`  | 6px radius, muted fill at 60% when closed and white when open. Trigger 14px medium dark text with 12px padding, cyan chevron, optional 12px muted `meta` line; body below a 1px top border with 12px padding. |

| State  | Look                                                     |
| ------ | -------------------------------------------------------- |
| Closed | Chevron points right; the content is not rendered        |
| Open   | Chevron points down; the content shows under the trigger |
| Focus  | 2px cyan outline with a 2px offset on the trigger        |

For a label above a block of text in the body, use `<p className="mb-1 font-semibold text-primary">`.

## Accessibility

- Built on Radix Accordion: each trigger is a `button` inside a heading (`h3` by default, set `headingLevel` to fit the page) with `aria-expanded` and `aria-controls`; the content is a `region` labelled by its trigger.
- Enter or Space toggles a section; Arrow Up/Down, Home and End move between triggers.
- Keep the visible title inside the trigger; the chevron is `aria-hidden`.
- Muted `meta` text meets contrast on the closed fill (4.5:1): the item is white and the 60% muted tint sits on its closed trigger, so the fill looks the same on a card and on the page background. Do not give the item or trigger a darker fill.
