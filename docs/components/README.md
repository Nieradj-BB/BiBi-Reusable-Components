# Components

One page per registry item: purpose, when to use it, install command, usage, props, variants and states, and accessibility notes. Live examples are in Storybook. Install every item at the tag the app is on (see [Use it in an app](../../README.md#use-it-in-an-app)).

All items are in v0.2.0. Items new in v0.2.0 are marked _(0.2.0)_; the rest came with v0.1.0.

## Actions

| Item                  | Component | Also installs |
| --------------------- | --------- | ------------- |
| [`button`](button.md) | Button    |               |

## Inputs and forms

| Item                            | Component              | Also installs         |
| ------------------------------- | ---------------------- | --------------------- |
| [`input`](input.md)             | Input                  |                       |
| [`textarea`](textarea.md)       | Textarea               |                       |
| [`label`](label.md)             | Label                  |                       |
| [`checkbox`](checkbox.md)       | Checkbox               |                       |
| [`radio-group`](radio-group.md) | RadioGroup _(0.2.0)_   |                       |
| [`switch`](switch.md)           | Switch _(0.2.0)_       |                       |
| [`select`](select.md)           | Select                 |                       |
| [`calendar`](calendar.md)       | Calendar _(0.2.0)_     | `button`              |
| [`date-picker`](date-picker.md) | DatePicker _(0.2.0)_   | `calendar`, `popover` |
| [`form-field`](form-field.md)   | FormField              | `label`, `alert`      |
| [`form-rhf`](form-rhf.md)       | Form (react-hook-form) | `label`, `form-field` |

## Data display

| Item                          | Component           | Also installs                                                                             |
| ----------------------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| [`badge`](badge.md)           | Badge               |                                                                                           |
| [`card`](card.md)             | Card                |                                                                                           |
| [`stat-tile`](stat-tile.md)   | StatTile _(0.2.0)_  | `skeleton`                                                                                |
| [`accordion`](accordion.md)   | Accordion _(0.2.0)_ |                                                                                           |
| [`data-table`](data-table.md) | DataTable           | `button`, `checkbox`, `empty-state`, `input`, `label`, `pagination`, `select`, `skeleton` |
| [`chart`](chart.md)           | Chart               |                                                                                           |

## Feedback

| Item                            | Component         | Also installs |
| ------------------------------- | ----------------- | ------------- |
| [`alert`](alert.md)             | Alert _(0.2.0)_   |               |
| [`spinner`](spinner.md)         | Spinner _(0.2.0)_ |               |
| [`skeleton`](skeleton.md)       | Skeleton          |               |
| [`empty-state`](empty-state.md) | EmptyState        |               |
| [`sonner`](sonner.md)           | Toast             | `button`      |

## Overlays

| Item                                | Component              | Also installs |
| ----------------------------------- | ---------------------- | ------------- |
| [`dialog`](dialog.md)               | Dialog                 | `button`      |
| [`alert-dialog`](alert-dialog.md)   | AlertDialog            | `button`      |
| [`sheet`](sheet.md)                 | Sheet                  | `button`      |
| [`popover`](popover.md)             | Popover                |               |
| [`tooltip`](tooltip.md)             | Tooltip                |               |
| [`dropdown-menu`](dropdown-menu.md) | DropdownMenu _(0.2.0)_ |               |

## Navigation and layout

| Item                            | Component            | Also installs              |
| ------------------------------- | -------------------- | -------------------------- |
| [`tabs`](tabs.md)               | Tabs                 |                            |
| [`pagination`](pagination.md)   | Pagination _(0.2.0)_ | `select`                   |
| [`page-header`](page-header.md) | PageHeader           |                            |
| [`app-shell`](app-shell.md)     | AppShell             | `badge`, `button`, `sheet` |

Every component also installs `theme` and `utils`, and the items those items need (DatePicker also brings Button through Calendar). The npm packages each item needs (for example `react-day-picker` for Calendar and DatePicker) are listed per item in [`registry.json`](../../registry.json).
