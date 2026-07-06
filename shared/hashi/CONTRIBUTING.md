# Contributing to @zenml/hashi

How to add or change a component so the design system stays trustworthy.
The Storybook is the canonical reference for hashi; a component without
stories does not exist as far as consumers are concerned, and CI enforces
that (see Enforcement below).

## Adding a component

1. **Place the source.**
   - `src/primitives/` — shadcn-style primitives, kebab-case (`dropdown-menu.tsx`).
   - `src/components/` — composed, brand-aware components, PascalCase
     (`WorkspaceIdentityBand.tsx`, file name = export name).
   - Component families may live in a subdirectory (`src/components/timeline/`)
     — the story rules and the coverage gate apply there too.
   - The `package.json` exports wildcards pick the file up automatically; no
     exports edit needed.
2. **Write the colocated stories** — `X.stories.tsx` next to `X.tsx`, same
   basename. Conventions:
   - `import type { Meta, StoryObj } from "@storybook/react-vite"`.
   - Title taxonomy: `Primitives/<Name>` or `Components/<Name>`; components in
     a subdirectory group under it (`Components/Timeline/<Name>`).
   - Import the subject relatively (`./X`); cross-folder imports use the
     `@zenml/hashi/...` self-alias.
   - Cover: an args-driven `Default`, every variant/size/state, one realistic
     composed example. Use real-looking copy, never lorem ipsum. Shared demo
     rosters/lists live in `src/storybook/fixtures.ts` — extend it instead of
     re-declaring fixtures.
   - When `src/lib/` already models the domain (e.g. `lib/timeline/`,
     `lib/onboarding.ts`), build story data through those helpers instead of
     hand-rolling parallel shapes — the story should exercise the same code
     path the app does.
   - Overlay components: trigger-driven stories plus exactly ONE always-open
     story named `Open` with
     `parameters: { docs: { story: { inline: false, iframeHeight: N } } }`
     (keeps autodocs pages usable — all stories of a file mount together
     there).
   - Use hashi's own primitives in story chrome (`Button`, `IconButton`, ...)
     — never hand-roll approximations of them.
   - A global decorator already applies brand (`data-app`) / mode (`.dark`)
     and a `TooltipProvider`; never set those per story.
3. **Verify in all four combos.** `pnpm --filter @zenml/hashi storybook`
   (port 6007) and flip the Brand and Mode toolbars: ZenML/Kitaru ×
   light/dark. A component is not done until all four read well.
4. **Run the gates.**
   - `pnpm --filter @zenml/hashi typecheck` — type-checks the package AND the
     stories + `.storybook/` config (`tsconfig.storybook.json`).
   - `pnpm --filter @zenml/hashi test` — runs (a) the node guards, including
     story coverage, and (b) every story as a headless-Chromium render test
     with **axe accessibility assertions** (`a11y: { test: "error" }`).

## Definition of done

- [ ] Colocated `X.stories.tsx` with Default + variants + composed example
- [ ] All four brand × mode combos verified in the Storybook toolbar
- [ ] `pnpm test` green — render + axe checks pass for every story
- [ ] `pnpm typecheck` green
- [ ] No `react-router`, store, data-client, or app-code imports (pure UI)
- [ ] All colors `oklch()` through theme tokens — no hex/rgb/hsl
- [ ] Text contrast ≥ 4.5:1 (3:1 for large text) on the surfaces it renders on
- [ ] Icon-only buttons have `aria-label`; images/labeled spans have a role

## Accessibility policy

Stories run axe with `test: "error"` — violations fail CI. Disabling a rule is
allowed only per story, only with a comment explaining why, and only when the
violation is a story-only artifact (e.g. two Toasters mounted to demo the
`position` prop) or a documented upstream/API gap. Never disable rules
globally; never silence a violation that users would hit in production.

## Enforcement

- `src/storybook/story-coverage.test.ts` fails CI when any `.tsx` file under
  `src/primitives/` or `src/components/` (recursively, subdirectories
  included) lacks a colocated `.stories.tsx`. Colocated `.figma.tsx`,
  `.spec.tsx`, and `.test.tsx` files are exempt — they document or test a
  component, they aren't one.
- The vitest `storybook` project renders every story in Chromium and asserts
  zero axe violations.
- `tsconfig.json` excludes stories from the package build program;
  `tsconfig.storybook.json` type-checks them (chained into `typecheck`).
- Consumers never see story code: the `./globals.css` export points at
  `src/styles/consumer.css` (excludes `*.stories.tsx` from the Tailwind scan)
  and `*.stories` subpaths are null-exported in `package.json`.

## Changing an existing component

Update its stories in the same PR when behavior, variants, or visuals change.
The stories are the spec — a stale story is a lying spec. Run the same gates.

## Figma sync (Code Connect + Storybook Design tab)

Hashi's canonical Figma library is the **"Hashi Design System"** file
(`IZhfgAOIPjDObsCtpFKhRY`, ZenML org). Three artifacts keep it linked to code:

- **`<component>.figma.tsx`** — colocated Code Connect file (`figma.connect()`)
  mapping the Figma component set to the code API. Validated by
  `npx figma connect parse` (CI: `code-connect.yml`) and published to Figma on
  merge to `main` (needs the `FIGMA_ACCESS_TOKEN` repo secret). Excluded from
  tsc and the story-coverage gate.
- **`parameters.design`** in the component's stories — embeds the Figma
  component in Storybook's Design tab (`@storybook/addon-designs`).
- **Figma component description** — carries the code API summary shown in
  Dev Mode.

When a component's props change, update its `.figma.tsx` in the same PR —
CI republishes automatically. When adding a component that has a Figma
counterpart, add both the `.figma.tsx` and the `parameters.design` URL.
Icon mappings live in `src/icons.figma.tsx` (generated from the lucide set
hashi imports).
