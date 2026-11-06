# Components

One page per registry item: purpose, when to use it, install command, usage, props, variants and states, and accessibility notes. Live examples are in Storybook. Install every item at the tag the app is on (see [Use it in an app](../../README.md#use-it-in-an-app)).

All items are part of v1 (0.1.0).

## Actions

| Item                  | Component | Also installs |
| --------------------- | --------- | ------------- |
| [`button`](button.md) | Button    |               |

## Inputs and forms

| Item                          | Component              | Also installs         |
| ----------------------------- | ---------------------- | --------------------- |
| [`input`](input.md)           | Input                  |                       |
| [`textarea`](textarea.md)     | Textarea               |                       |
| [`label`](label.md)           | Label                  |                       |
| [`checkbox`](checkbox.md)     | Checkbox               |                       |
| [`select`](select.md)         | Select                 |                       |
| [`form-field`](form-field.md) | FormField              | `label`               |
| [`form-rhf`](form-rhf.md)     | Form (react-hook-form) | `label`, `form-field` |

## Data display

| Item                          | Component | Also installs                                           |
| ----------------------------- | --------- | ------------------------------------------------------- |
| [`badge`](badge.md)           | Badge     |                                                         |
| [`card`](card.md)             | Card      |                                                         |
| [`data-table`](data-table.md) | DataTable | `checkbox`, `empty-state`, `input`, `label`, `skeleton` |
| [`chart`](chart.md)           | Chart     |                                                         |

## Feedback

| Item                            | Component  | Also installs |
| ------------------------------- | ---------- | ------------- |
| [`skeleton`](skeleton.md)       | Skeleton   |               |
| [`empty-state`](empty-state.md) | EmptyState |               |
| [`sonner`](sonner.md)           | Toast      | `button`      |

## Overlays

| Item                              | Component   | Also installs |
| --------------------------------- | ----------- | ------------- |
| [`dialog`](dialog.md)             | Dialog      | `button`      |
| [`alert-dialog`](alert-dialog.md) | AlertDialog | `button`      |
| [`sheet`](sheet.md)               | Sheet       | `button`      |
| [`popover`](popover.md)           | Popover     |               |
| [`tooltip`](tooltip.md)           | Tooltip     |               |

## Navigation and layout

| Item                            | Component  | Also installs              |
| ------------------------------- | ---------- | -------------------------- |
| [`tabs`](tabs.md)               | Tabs       |                            |
| [`page-header`](page-header.md) | PageHeader |                            |
| [`app-shell`](app-shell.md)     | AppShell   | `badge`, `button`, `sheet` |

Every component also installs `theme` and `utils`. The npm packages each item needs are listed per item in [`registry.json`](../../registry.json).
