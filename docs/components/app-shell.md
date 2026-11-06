# AppShell

The frame of every app: a sidebar with the app name, navigation and signed-in user next to a scrolling content area, and a top bar with a menu on narrow screens.

## When to use

- As the root layout of every app after sign-in.
- With up to about seven top-level destinations. Dialogs such as Help can sit in the nav as buttons.

## When not to use

- Sign-in and full-page error screens: they render without the shell.
- Second-level navigation: use tabs in the page header.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/app-shell#v0.1.0
```

Also installs `badge`, `button` and `sheet` from this registry. The block lands in `components/app-shell/app-shell.tsx`.

## Usage

```tsx
import { FileTextIcon, FolderIcon, UsersIcon } from "lucide-react"
import { Link, useLocation } from "react-router"

import {
  AppShell,
  type AppShellNavItem,
} from "@/components/app-shell/app-shell"
import { PageHeader } from "@/components/ui/page-header"

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const navItems: AppShellNavItem[] = [
    { label: "Projecten", href: "/projecten", icon: FolderIcon },
    { label: "Documenten", href: "/documenten", icon: FileTextIcon, count: 3 },
    { label: "Team", href: "/team", icon: UsersIcon },
  ].map((item) => ({ ...item, active: pathname.startsWith(item.href) }))

  return (
    <AppShell
      appName="Projecten"
      navItems={navItems}
      user={{ name: "Sanne de Vries" }}
      onSignOut={() => signOut()}
      renderLink={({ href, ...props }) => <Link to={href} {...props} />}
    >
      <PageHeader title="Projecten" subtitle="Alle lopende projecten" />
      {children}
    </AppShell>
  )
}
```

`renderLink` receives the link's `href`, `className`, `aria-current`, `onClick` (closes the mobile menu) and `children`; pass them all on to your router's link. Without it, items render as plain `<a>` elements.

A nav item without `href` is a button, for example to open a Help dialog:

```tsx
{
  label: "Help",
  icon: CircleHelpIcon,
  dialogOpen: helpOpen,
  onSelect: () => setHelpOpen(true),
}
```

## Props

`AppShell` (a `div`; other `div` props are passed on):

| Prop               | Type                                      | Default            | Notes                                                                |
| ------------------ | ----------------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `appName`          | `string`                                  |                    | Required. Shown in cyan after "Blue Bricks".                         |
| `navItems`         | `AppShellNavItem[]`                       |                    | Required. See below.                                                 |
| `user`             | `{ name: string; initials?: string }`     |                    | Required. Initials default to the first and last word of the name.   |
| `onSignOut`        | `() => void`                              |                    | Shows the sign-out icon button when set.                             |
| `renderLink`       | `(props: AppShellLinkProps) => ReactNode` | `<a>`              | Render nav links with the app's router.                              |
| `detailPanel`      | `ReactNode`                               |                    | Rendered after the content area, e.g. a `<Sheet>` with details.      |
| `mobileBreakpoint` | `number` (px)                             | `768`              | Below this viewport width the sidebar becomes a top bar with a menu. |
| `children`         | `ReactNode`                               |                    | The page, rendered in `<main>`, which scrolls on its own.            |
| `navLabel`         | `string`                                  | `"Hoofdmenu"`      | `aria-label` of the nav.                                             |
| `skipLinkLabel`    | `string`                                  | `"Naar de inhoud"` | Text of the skip link.                                               |
| `menuLabel`        | `string`                                  | `"Menu"`           | Name of the menu button and the menu sheet.                          |
| `closeMenuLabel`   | `string`                                  | `"Menu sluiten"`   | Name of the close button in the menu sheet.                          |
| `signOutLabel`     | `string`                                  | `"Uitloggen"`      | Name of the sign-out icon button.                                    |
| `className`        | `string`                                  |                    | Merged with `cn()`. The shell is `h-svh` by default.                 |

`AppShellNavItem`:

| Field        | Type                  | Notes                                                                                                           |
| ------------ | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `label`      | `string`              | Required; also the React key, so keep labels unique.                                                            |
| `icon`       | lucide icon component | Required; rendered at 20px, `aria-hidden`.                                                                      |
| `href`       | `string`              | Renders a link through `renderLink`. Without it the item is a `<button>`.                                       |
| `active`     | `boolean`             | Current page: `aria-current="page"`, ice background, cyan text.                                                 |
| `count`      | `number`              | Secondary count badge at the end of the row.                                                                    |
| `countLabel` | `string`              | Hidden text after the count. Default `"nieuw"`; `""` for none.                                                  |
| `onSelect`   | `() => void`          | Button items: runs on click.                                                                                    |
| `dialogOpen` | `boolean`             | Button items that open a dialog: adds `aria-haspopup="dialog"` and `aria-expanded`; open shows the active look. |

## Variants and states

- Desktop (from the breakpoint): 250px card-white sidebar with a right border. Brand area 24px padding and bottom border; nav 12px padding with 4px gaps; user footer 16px padding and top border.
- Nav item: 40px high, 12px gap, 14px medium text. Hover: accent background. Active or open dialog: ice background and cyan text. Focus: 2px ring with 2px offset.
- User footer: 32px navy initials avatar, the name truncated, a 28px sign-out icon button (muted, accent background on hover).
- Skip link: hidden until focused, then a cyan button-shaped link (6px radius) top left over the sidebar.
- Mobile (below the breakpoint): a 56px card-white top bar with a ghost menu button and the brand. The menu opens as a modal left sheet (`min(85%, 18rem)`) with a 56px head (brand and close button), the same nav and the user footer. Choosing a destination closes it.

## Accessibility

- The skip link "Naar de inhoud" is the first focusable element, becomes visible on focus and moves focus to `<main>` (`tabIndex=-1`, no focus ring).
- The nav has an `aria-label`; the active item has `aria-current="page"`; dialog buttons use `aria-haspopup="dialog"` and `aria-expanded`.
- Sign-out is an icon button with `aria-label` "Uitloggen"; the initials avatar is `aria-hidden` next to the visible name; a count badge includes hidden text ("3 nieuw").
- Below the breakpoint the menu button has `aria-expanded` and `aria-controls`, and opens a modal dialog named "Menu" with a focus trap, Escape to close and focus return to the menu button. The narrow top bar is a `<header>` (banner).
- The content area is the page's `<main>`; render a single `h1` in it (the PageHeader title).
- Cyan text (app name, active item, skip link) is an accepted brand-colour contrast exception.
