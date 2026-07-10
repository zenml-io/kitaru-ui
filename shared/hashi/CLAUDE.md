# @zenml/hashi — agent rules

Full contributor doc: `CONTRIBUTING.md` (read it before adding or changing a
component). The non-negotiables:

1. **Every component lives in its own folder: `<Name>/<Name>.tsx` +
   `<Name>.stories.tsx` + `<Name>.figma.tsx`, same folder, same basename**
   (`src/primitives/<name>/`, `src/components/<Name>/` — every folder sits
   directly under its root; nested family directories are not supported,
   group related components via Storybook titles like
   `Components/Timeline/<Name>` instead —
   `src/storybook/folder-layout.test.ts` guards the shape).
   `npx shadcn add <c>` writes flat — move the file into its
   own folder after. Editor auto-import won't suggest hashi subpaths for new
   code; type the specifier manually.
2. **Every component ships as a trio: source + stories + Figma parity.**
   - `<Name>.stories.tsx` (CI-enforced by the story-coverage gate).
   - A Figma build in the "Hashi Design System" file
     (`IZhfgAOIPjDObsCtpFKhRY`) on a page templated per
     `docs/figma-page-template.md`, plus a colocated `<Name>.figma.tsx` Code
     Connect file and a `parameters.design` URL in the stories.
   - A row in `FIGMA-PARITY.md`. Components with no static visual surface
     record a `skip` verdict there; thin wrappers over an existing primitive
     record `map-to-existing` and connect to the existing node.
3. **Prop or visual changes update the stories, the `.figma.tsx`, and the
   Figma variants in the same PR.** Stale stories and stale connects are
   lying specs.
4. **Gates before done:** `pnpm --filter @zenml/hashi typecheck`,
   `pnpm --filter @zenml/hashi test` (stories render headless with axe
   errors on, includes the folder-layout guard), `npx figma connect parse`
   exit 0, prettier on changed files.
5. **Figma build rules:** bind fills/strokes to variables and text to text
   styles (no raw hex/fonts); variant axes mirror what the stories
   enumerate; verify visual claims against the component's CSS, not story
   labels; library icons are outline vectors — recolor instances via vector
   fills, never strokes; overlays are drawn as static content surfaces only
   (no portals/backdrops).
