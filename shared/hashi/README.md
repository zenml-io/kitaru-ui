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

### File naming

| Directory                | Case           | Example                         |
| ------------------------ | -------------- | ------------------------------- |
| `src/components/`        | **PascalCase** | `WorkspaceIdentityBand.tsx`     |
| `src/primitives/`        | kebab-case     | `dropdown-menu.tsx`             |
| `src/lib/`, `src/hooks/` | kebab-case     | `state-styles.ts`, `use-foo.ts` |

- Files in `src/components/` use **PascalCase**, matching the exported component name (`WorkspaceIdentityBand.tsx` exports `WorkspaceIdentityBand`).
- Files in `src/primitives/` keep **kebab-case** to stay compatible with the `shadcn` CLI generator (`npx shadcn add dropdown-menu` writes `dropdown-menu.tsx`).
- Non-component TypeScript files (`lib/`, `hooks/`) stay kebab-case as usual.

Import paths mirror the file name verbatim — wildcard exports in `package.json` resolve `@zenml/hashi/components/<File>` → `./src/components/<File>.tsx`. PascalCase paths therefore reach PascalCase files; primitives stay lower-case on both sides.

## Storybook & tests

The package ships its own Storybook (`pnpm --filter @zenml/hashi storybook`, port 6007) with a Brand (ZenML/Kitaru) × Mode (light/dark) toolbar. Every component has colocated `X.stories.tsx`; the stories double as the test suite — `pnpm --filter @zenml/hashi test` renders all of them headless in Chromium with axe accessibility assertions, plus a story-coverage guard that fails when a component lacks stories.

**Adding or changing a component? Read `CONTRIBUTING.md`** — recipe, definition-of-done checklist, and the accessibility policy. The short version: no component lands without stories, four-combo verification, and green `test` + `typecheck`.

### Adding more content

When adding more, place sources under `src/` and add a subpath to `package.json` `exports` (the `./globals.css` entry is the existing pattern). Bump `private: true` to `false` and add a real `version` if/when publishing to npm.
