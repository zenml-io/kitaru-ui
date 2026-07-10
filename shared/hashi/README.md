# @zenml/hashi (Hashi)

Hashi — the shared design system for ZenML frontend apps.

Currently exposes:

- `@zenml/hashi/globals.css` — the canonical dual-theme stylesheet (generic ZenML at `:root`/`.dark`, Kitaru deviation under `[data-app="kitaru"]`).
- `@zenml/hashi/primitives/*` — shadcn-style primitives (Button, Input, DropdownMenu, …).
- `@zenml/hashi/components/*` — higher-level composed components (identity bands, switcher pills, brand marks, …).
- `@zenml/hashi/lib/*` — pure helpers (`cn`, `state-styles`).

## Consumers

- `apps/kitaru-ui` (OSS) — consumes `@zenml/hashi/globals.css` (Kitaru theme via `<html data-app="kitaru">`).
- Other internal ZenML apps — consume primitives, components, and lib helpers.

## Conventions

### File layout

Every component lives in its own folder, named after the component, with its
source, stories, and Figma Code Connect file colocated inside:

```
src/primitives/dropdown-menu/
├── dropdown-menu.tsx
├── dropdown-menu.stories.tsx
└── dropdown-menu.figma.tsx

src/components/WorkspaceIdentityBand/
├── WorkspaceIdentityBand.tsx
├── WorkspaceIdentityBand.stories.tsx
└── WorkspaceIdentityBand.figma.tsx

```

| Directory                | Case           | Example                                           |
| ------------------------ | -------------- | ------------------------------------------------- |
| `src/components/`        | **PascalCase** | `WorkspaceIdentityBand/WorkspaceIdentityBand.tsx` |
| `src/primitives/`        | kebab-case     | `dropdown-menu/dropdown-menu.tsx`                 |
| `src/lib/`, `src/hooks/` | kebab-case     | `state-styles.ts`, `use-foo.ts`                   |

- Files in `src/components/` use **PascalCase**, matching the exported component name (folder and file name both = `WorkspaceIdentityBand`).
- Files in `src/primitives/` keep **kebab-case** to stay compatible with the `shadcn` CLI generator (`npx shadcn add dropdown-menu` writes a flat `dropdown-menu.tsx` — move it into `dropdown-menu/dropdown-menu.tsx` after).
- Non-component TypeScript files (`lib/`, `hooks/`) stay flat and kebab-case as usual — no per-file folder.

Import specifiers are unchanged by the folder move and still mirror the component name — `package.json` `exports` use repeated-`*` targets to reach into the per-component folder: `"./components/*": "./src/components/*/*.tsx"` resolves `@zenml/hashi/components/<Name>` → `./src/components/<Name>/<Name>.tsx`. Nested family directories are not supported — the wildcard reaches exactly one folder level (a deeper path would double-substitute into a broken target). Group related components in Storybook titles (`Components/Timeline/...`) instead. PascalCase paths therefore reach PascalCase files; primitives stay lower-case on both sides.

One DX cost: TypeScript's reverse export-map lookup only follows the first `*`, so editors no longer suggest hashi subpath imports for new code — existing imports keep resolving fine, but new ones need the specifier typed out by hand.

## Storybook & tests

The package ships its own Storybook (`pnpm --filter @zenml/hashi storybook`, port 6007) with a Brand (ZenML/Kitaru) × Mode (light/dark) toolbar. Every component has colocated `X.stories.tsx`; the stories double as the test suite — `pnpm --filter @zenml/hashi test` renders all of them headless in Chromium with axe accessibility assertions, plus a story-coverage guard that fails when a component lacks stories.

**Adding or changing a component? Read `CONTRIBUTING.md`** — recipe, definition-of-done checklist, and the accessibility policy. The short version: no component lands without stories, four-combo verification, and green `test` + `typecheck`.

### Adding more content

When adding more, place sources under `src/` and add a subpath to `package.json` `exports` (the `./globals.css` entry is the existing pattern). Bump `private: true` to `false` and add a real `version` if/when publishing to npm.
