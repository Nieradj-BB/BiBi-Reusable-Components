/**
 * Decision 5: contrast failures caused by the fixed brand cyan are accepted.
 * axe still checks colour contrast everywhere else. Only an element that is
 * coloured brand cyan right now, and its content, is skipped:
 *
 * - its resting-state classes contain `text-brand-cyan` or `bg-brand-cyan`
 *   (optionally with an opacity such as `/90`), or
 * - it has a state variant of those classes and is in that state, such as
 *   `data-[state=active]:text-brand-cyan` on an element with
 *   `data-state="active"`.
 *
 * `hover:`, `focus:` and other pseudo-class variants never exempt an element,
 * and neither does a state variant while the element is not in that state:
 * the colours it renders are checked.
 */
const brandTokens = ["text-brand-cyan", "bg-brand-cyan"]

/** Attribute variants used in the library, and the attribute they test. */
const stateVariants: Record<string, string> = {
  "data-[state=active]": '[data-state="active"]',
  "data-[state=checked]": '[data-state="checked"]',
  "data-[state=indeterminate]": '[data-state="indeterminate"]',
  "data-[state=on]": '[data-state="on"]',
  "aria-[current=page]": '[aria-current="page"]',
  "aria-[current=true]": '[aria-current="true"]',
  "aria-expanded": '[aria-expanded="true"]',
  "aria-selected": '[aria-selected="true"]',
  "aria-checked": '[aria-checked="true"]',
  // Calendar day buttons (react-day-picker, shadcn Calendar)
  "data-[selected-single=true]": '[data-selected-single="true"]',
  "data-[range-start=true]": '[data-range-start="true"]',
  "data-[range-end=true]": '[data-range-end="true"]',
}

const resting = brandTokens.flatMap((token) => [
  // the exact class, e.g. `text-brand-cyan`
  `[class~="${token}"]`,
  // with an opacity modifier, e.g. `bg-brand-cyan/90`
  `[class^="${token}/"]`,
  `[class*=" ${token}/"]`,
])

const inState = Object.entries(stateVariants).flatMap(([variant, attribute]) =>
  brandTokens.map((token) => `${attribute}[class~="${variant}:${token}"]`)
)

const brandCyan = [...resting, ...inState]

export const brandContrastSelector = [
  "*",
  ...brandCyan.map((selector) => `:not(${selector})`),
  ...brandCyan.map((selector) => `:not(${selector} *)`),
].join("")
