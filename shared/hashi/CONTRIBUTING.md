# Contributing to @zenml/hashi

How to add or change a component so the design system stays trustworthy.
The Storybook is the canonical reference for hashi; a component without
stories does not exist as far as consumers are concerned, and CI enforces
that (see Enforcement below).

## Brand theming

### ZenML Pro legacy

The `[data-app="zenml-pro"]` brand exists so new ZenML Pro features can use
Hashi components while embedded in the legacy purple product shell. It is
light-only because the legacy product has no dark mode.

Tokens in `src/styles/zenml-pro-legacy.css` alias the live variables from
`apps/zenml-pro-ui/src/styles/globals.css` and include frozen fallback values
for standalone rendering. Brand purple and the required legacy `hsl()` values
are allowed only in this file, nowhere else in Hashi. The single exception is
member-avatar tint 5 in `globals.css`, a categorical colour for telling people
apart that carries no brand meaning.

It ships as its own entry, `@zenml/hashi/zenml-pro-legacy.css`, and must be
imported after `globals.css`: its blocks outrank the `:root` ZenML tokens on
source order, not specificity. At rebrand, delete the file, its export entry,
the imports, and every `data-app="zenml-pro"` attribute so those surfaces fall
through to the default `:root` ZenML brand.

Never style a component with a Tailwind palette utility such as `bg-blue-100`.
Consuming apps redefine names in the `--color-<hue>-<step>` namespace, and
`zenml-pro-ui` declares several of them as bare HSL triplets, so the utility
resolves to a non-colour and the declaration is dropped inside that app. Use a
theme token.

## Adding a component

1. **Place the source.** Every component lives in its own folder, named after
   the component, alongside its stories and Figma file:
   - `src/primitives/<name>/<name>.tsx` — shadcn-style primitives, kebab-case
     (`dropdown-menu/dropdown-menu.tsx`).
   - `src/components/<Name>/<Name>.tsx` — composed, brand-aware components,
     PascalCase (`WorkspaceIdentityBand/WorkspaceIdentityBand.tsx`, folder and
     file name = export name).
   - Every component folder sits DIRECTLY under its root — nested family
     directories are not supported. The exports and importPaths wildcards
     reach exactly one folder level: a deeper path double-substitutes into a
     broken specifier (imports stop resolving) or silently drops the extra
     segment from published Code Connect imports. Group related components
     in Storybook titles instead (`title: "Components/Timeline/<Name>"`).
   - The `package.json` exports wildcards pick the file up automatically; no
     exports or figma.config edit is needed for a new component.
     `src/storybook/folder-layout.test.ts` guards the folder shape in CI.
   - Using `npx shadcn add <c>`? It writes a flat file
     (`src/primitives/<c>.tsx`) — move it into its own folder
     (`src/primitives/<c>/<c>.tsx`) before continuing.
   - Editor auto-import no longer suggests hashi subpath imports for new
     code (TypeScript's reverse export-map lookup is first-star-only against
     the repeated-`*` targets) — type the `@zenml/hashi/...` specifier
     manually. Existing imports still resolve fine.
2. **Write the stories** — `<Name>.stories.tsx` in the same folder as
   `<Name>.tsx`, same basename. Conventions:
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
5. **Build the Figma counterpart.** Every component ships with its Figma
   parity artifacts in the same PR — see "Figma parity" below. If the
   component has no static visual surface, record a `skip` or
   `map-to-existing` verdict in `FIGMA-PARITY.md` instead; the tracker row
   is mandatory either way.

## Definition of done

- [ ] Colocated `X.stories.tsx` with Default + variants + composed example
- [ ] All four brand × mode combos verified in the Storybook toolbar
- [ ] `pnpm test` green — render + axe checks pass for every story
- [ ] `pnpm typecheck` green
- [ ] No `react-router`, store, data-client, or app-code imports (pure UI)
- [ ] Component colors use `oklch()` theme tokens with no hex/rgb/hsl. The documented legacy ZenML Pro theme file is the only exception.
- [ ] Text contrast ≥ 4.5:1 (3:1 for large text) on the surfaces it renders on
- [ ] Icon-only buttons have `aria-label`; images/labeled spans have a role
- [ ] Figma component built (or `skip`/`map-to-existing` verdict recorded),
      colocated `.figma.tsx` parse-green, `parameters.design` link in the
      stories, `FIGMA-PARITY.md` row updated

## Accessibility policy

Stories run axe with `test: "error"` — violations fail CI. Disabling a rule is
allowed only per story, only with a comment explaining why, and only when the
violation is a story-only artifact (e.g. two Toasters mounted to demo the
`position` prop) or a documented upstream/API gap. Never disable rules
globally; never silence a violation that users would hit in production.

## Enforcement

- `src/storybook/folder-layout.test.ts` fails CI when a component's files
  aren't colocated in a well-formed `<Name>/<Name>[.suffix].tsx` folder
  directly under its root (nested family directories are not supported),
  or when a file anywhere in the package's content dirs (`src/`,
  `.storybook/`, `docs/`) is an iCloud sync-conflict duplicate (` 2.tsx`
  etc).
- `src/storybook/story-coverage.test.ts` fails CI when any `.tsx` file under
  `src/primitives/` or `src/components/` (recursively, subdirectories
  included) lacks a colocated `.stories.tsx`. Colocated `.figma.tsx`,
  `.spec.tsx`, and `.test.tsx` files are exempt — they document or test a
  component, they aren't one.
- `src/storybook/figma-parity.test.ts` fails CI when any component source
  lacks both a colocated `.figma.tsx` and a `skip` verdict row in
  `FIGMA-PARITY.md` — the Figma parity rule above is enforced, not advisory.
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

## Figma parity (Code Connect + Storybook Design tab)

Hashi's canonical Figma library is the **"Hashi Design System"** file
(`IZhfgAOIPjDObsCtpFKhRY`, ZenML org). Every component in
`src/primitives/` and `src/components/` is expected to exist there too —
`FIGMA-PARITY.md` is the per-component ledger, and a component without a
tracker row is a gap. Parity for a component means all of:

1. **A Figma build** in the library, on its own page laid out per
   `docs/figma-page-template.md` (spec header card + showcase stage; the
   fastest path is cloning an existing templated page and rewriting the
   copy). Rules that keep builds consistent:
   - Bind every fill/stroke to a library variable and every text node to a
     text style — no raw hex, no raw fonts. Audit `textStyleId === ""`
     before finishing.
   - Variant axes mirror what the stories enumerate — never invent axes the
     code cannot express, and verify visual claims against the component's
     actual CSS, not story labels or comments.
   - Icons in the library are outline vectors: recolor instances by setting
     vector **fills**, never strokes (stroke overrides render double glyphs).
   - Overlay components (dialogs, sheets, popovers) are built as static
     content surfaces only — portals, backdrops, and animations are
     runtime-only and are not drawn.
2. **A colocated `<component>.figma.tsx`** (`figma.connect()`) mapping the
   Figma variants to the code API, authored in the same PR as the build.
   Validated by `npx figma connect parse` (CI: `code-connect.yml`) and
   published to Figma on merge to `main` (needs the `FIGMA_ACCESS_TOKEN`
   repo secret). Excluded from tsc and the story-coverage gate. Judge the
   parse gate by exit code plus entry count; parser limits worth knowing:
   import the subject relatively (self-alias imports can break the parser),
   no JSX fragments inside `figma.enum` values (wrap in `span.contents`),
   no computed expressions in example props (`{size / 12}` is a
   ParserError) — bare identifiers and object literals are fine.
3. **A `parameters.design` link** in the component's stories pointing at the
   set's node URL — embeds the Figma component in Storybook's Design tab
   (`@storybook/addon-designs`).
4. **An updated `FIGMA-PARITY.md` row** (node id, status, build notes).

Components with no static visual surface (runtime portals, pure behavioral
wrappers, scroll-metric-driven views) record a `skip` verdict with
reasoning; thin wrappers over an existing primitive record `map-to-existing`
and point their `.figma.tsx` at the existing node (variant-restricted where
it applies). Both still get a tracker row.

When a component's props change, update its `.figma.tsx` and Figma variants
in the same PR — CI republishes automatically. Icon mappings live in
`src/icons.figma.tsx` (one entry per icon published on the Icons page
of the Hashi Design System Figma file).
