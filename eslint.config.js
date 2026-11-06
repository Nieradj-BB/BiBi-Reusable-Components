import js from "@eslint/js"
import betterTailwindcss from "eslint-plugin-better-tailwindcss"
import jsxA11y from "eslint-plugin-jsx-a11y-x"
import reactHooks from "eslint-plugin-react-hooks"
import storybook from "eslint-plugin-storybook"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

const variants = "^(?:.*:)?"
const palette =
  "slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"

// Classes that break the fixed theme (docs/decisions.md, decisions 3, 11 and 23).
const restrictedClasses = [
  {
    pattern: `${variants}-?[a-z]+(?:-[a-z]+)*-(?:${palette})-(?:50|[1-9]00|950)(?:/\\S+)?$`,
    message:
      "Tailwind palette colours are not allowed: use a theme token such as bg-primary, text-muted-foreground or bg-brand-cyan.",
  },
  {
    pattern: `${variants}-?[a-z]+(?:-[a-z]+)*-(?:white|black)(?:/\\S+)?$`,
    message:
      "white and black are not theme colours: use bg-card, text-primary-foreground or text-foreground.",
  },
  {
    pattern:
      "\\[(?:color:)?(?:#|rgba?\\(|hsla?\\(|oklch\\(|oklab\\(|lab\\(|lch\\(|hwb\\(|color-mix\\()",
    message:
      "Arbitrary colour values are not allowed: use a theme token (bg-primary, bg-primary/90 where the spec uses it).",
  },
  {
    pattern: `${variants}dark:.*$`,
    message: "Light mode only: no dark: variants.",
  },
  {
    pattern: `${variants}(?!rounded(?:-(?:t|r|b|l|s|e|ss|se|ee|es|tl|tr|br|bl))?-(?:sm|md|xl|full|none)$)rounded(?:-.*)?$`,
    message:
      "Use rounded-md (controls), rounded-xl (cards, panels, dialogs), rounded-full (pills, circles) or rounded-sm (chart bar ends).",
  },
  {
    pattern: `${variants}(?!shadow-(?:tile|tile-hover|card|panel|none)$)shadow(?:-.*)?$`,
    message:
      "Use the theme shadows only: shadow-tile, shadow-tile-hover, shadow-card or shadow-panel.",
  },
  {
    pattern: `${variants}(?:inset-shadow|drop-shadow|text-shadow)(?:-.*)?$`,
    message:
      "Use the theme shadows only: shadow-tile, shadow-tile-hover, shadow-card or shadow-panel.",
  },
  {
    pattern: "^outline-(?:none|hidden)$",
    message:
      "In Tailwind 4 outline-none and outline-hidden cancel focus-visible:outline-2 (they set --tw-outline-style: none). Leave them out on focusable elements; use focus:outline-none only on containers that must never show focus.",
  },
]

const colourLiteral =
  "/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\\b|\\b(?:rgba?|hsla?|oklch|oklab|hwb)\\(/"
const colourLiteralMessage =
  "Colour literals are not allowed in components or stories: use theme tokens (bg-primary, var(--chart-1))."

export default defineConfig([
  globalIgnores([
    "node_modules",
    "storybook-static",
    "public",
    "coverage",
    "test-results",
    ".vitest-attachments",
  ]),
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.strict],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-console": "error",
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
    },
  },
  {
    files: ["**/*.tsx"],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.configs.recommended],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ["registry/**/*.{ts,tsx}", "stories/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts"],
    extends: [betterTailwindcss.configs["correctness-error"]],
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/styles.css",
        tsconfig: "tsconfig.json",
      },
    },
    rules: {
      "better-tailwindcss/no-restricted-classes": [
        "error",
        { restrict: restrictedClasses },
      ],
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-deprecated-classes": "error",
      "better-tailwindcss/no-unnecessary-whitespace": "error",
      "better-tailwindcss/enforce-canonical-classes": "error",
      // Class order is left to prettier-plugin-tailwindcss.
      "better-tailwindcss/enforce-consistent-class-order": "off",
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  },
  {
    files: ["registry/**/*.{ts,tsx}", "stories/**/*.{ts,tsx}"],
    ignores: ["stories/foundations/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: `Literal[value=${colourLiteral}]`,
          message: colourLiteralMessage,
        },
        {
          selector: `TemplateElement[value.raw=${colourLiteral}]`,
          message: colourLiteralMessage,
        },
      ],
    },
  },
  ...storybook.configs["flat/recommended"],
])
