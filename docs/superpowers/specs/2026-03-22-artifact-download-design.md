# Artifact Download Feature — Design Spec

**Date:** 2026-03-22
**Branch:** `bm/artifact-download`

---

## Overview

Add a download button to artifact visualizations so users can save artifact content locally. The button appears on hover as an overlay in the top-right corner of the visualization. No additional API calls are needed for text-based types — the content is already fetched for display. Images require a `fetch` of the image URL.

---

## Context

Artifacts appear in two places:

- **Inline trace** (`CheckpointRowArtifacts`): each expanded checkpoint row shows a chip toolbar (IN/OUT artifact selectors) and a named header bar above the visualization.
- **Right panel** (`CheckpointDetailPanelArtifacts`): shows artifact chips in a toolbar, then the visualization below.

Both use `ArtifactVisualizationContainer` → `VisualizationViewer` to render artifact content. The visualization hook (`useArtifactVisualization`) fetches from `/api/v1/artifact_versions/{id}/visualize` and caches via React Query. The response is `{ type: VisualizationType, value: string }` where `VisualizationType` is `"csv" | "html" | "image" | "markdown" | "json"`.

For text-based types, `value` is the full file content string. For `image`, `value` is a URL (used as `<img src>`).

The backend also exposes a two-step download API (`GET /download-token` → `GET /data?token=...`), but since the content is already available in the visualization cache, this API is not used.

---

## Architecture

### Approach

The download button is rendered as an **absolute overlay** inside `ArtifactVisualizationContainer`, in the top-right corner. The container becomes a `relative group/viz` wrapper; the button uses `opacity-0 group-hover/viz:opacity-100` to appear on hover.

This approach:

- Requires no state lifting — the hook has direct access to `visualizationData`
- Works identically in both inline trace and right panel (both use `ArtifactVisualizationContainer`)
- Requires no new header or wrapper components

---

## Files

### New: `src/modules/checkpoints/util/download-visualization.ts`

Pure async utility. Takes `visualization: ArtifactVisualization` and `filename: string` (base name, no extension), triggers a browser file download.

**Filename extension:** The utility appends the correct extension based on `visualization.type`: `.json`, `.md`, `.html`, `.csv`, or `.png` (image fallback). For images, if the data URL or response Content-Type specifies a more specific type (e.g. `image/jpeg`), use the corresponding extension. Filename sanitization (stripping characters invalid on common OS filesystems such as `/`, `\`, `:`) is out of scope for this iteration.

**Data URL parsing for images:** Extract the MIME type from the data URL prefix by taking the substring between `data:` and the first `;` (e.g. `data:image/png;base64,...` → `image/png`). Extract the base64 payload as the substring after the last `,` in the data URL (not after the first `;`, which would include `base64,`). Decode via `atob`, then convert to `Uint8Array` using `Uint8Array.from(atob(payload), c => c.charCodeAt(0))`, and create a `Blob` from it.

**Image URL assumptions:** The utility assumes image URLs are same-origin (served from the same host as the app). Cross-origin image URLs are not supported and out of scope.

**Per type:**

| Type                  | Strategy                                                          | MIME type             |
| --------------------- | ----------------------------------------------------------------- | --------------------- |
| `json`                | `Blob(value)` → object URL → `<a download>`                       | `application/json`    |
| `markdown`            | `Blob(value)` → object URL → `<a download>`                       | `text/markdown`       |
| `html`                | `Blob(value)` → object URL → `<a download>`                       | `text/html`           |
| `csv`                 | `Blob(value)` → object URL → `<a download>`                       | `text/csv`            |
| `image` (data URL)    | Parse base64 (see above), decode to `Blob`, download              | from data URL prefix  |
| `image` (regular URL) | `fetch(value, { credentials: 'include' })` → `.blob()` → download | from response headers |

Object URLs are revoked after use: append the `<a>` to the document, call `.click()`, then revoke the URL and remove the element in a `setTimeout(..., 0)` callback to ensure the browser has queued the download before the URL is invalidated.

### New: `src/modules/checkpoints/business-logic/use-download-visualization.ts`

Hook that wraps `downloadVisualization` with UI state.

```ts
{ download(visualization, filename): void, isDownloading: boolean }
```

- Sets `isDownloading = true` before calling the utility
- Sets `isDownloading = false` after completion or on error
- On error: calls `toast.error(...)` from `sonner` (consistent with the rest of the codebase), resets state

### Modified: `src/modules/checkpoints/feature/ArtifactVisualizationContainer.tsx`

- Add `filename: string` prop
- Wrap `VisualizationViewer` in a `relative group/viz` div
- Render an overlay download `Button` (variant `ghost`, size `icon-sm`):
  - Positioned `absolute top-2 right-2`
  - For all types except `html`: `opacity-0 group-hover/viz:opacity-100 transition-opacity`
  - For `html` type: always `opacity-100` (the iframe consumes pointer events and blocks CSS group-hover from the parent)
  - `disabled` when `isDownloading`; no loading spinner — disabled state is the only feedback during download
  - Uses `Download01` icon from `@untitledui/icons`
  - Needs `z-10` to ensure it renders above the iframe in the `html` type case (iframes create a stacking context and can paint over absolutely-positioned siblings)
- `visualizationData` is guaranteed non-null at render time due to the `useSuspenseQuery` in `useArtifactVisualization` and the `<Suspense>` boundary at the call site

### Modified: `src/modules/executions/ui/traces/CheckpointRowArtifacts.tsx`

Pass `filename={selected.entry.name}` to `ArtifactVisualizationContainer`.

### Modified: `src/modules/checkpoints/ui/CheckpointDetailPanelArtifacts.tsx`

Pass `filename={selectedArtifact.artifact.name}` to `ArtifactVisualizationContainer`.

---

## Error Handling

- Download failure (e.g. failed image fetch, blob creation error) → error toast, button re-enabled
- No retry logic

---

## Testing

### `download-visualization.ts` (unit)

- JSON: creates correct Blob MIME type and triggers download
- Markdown: same
- HTML: same
- CSV: same
- Image (data URL): correctly decodes base64 and downloads
- Image (URL): mocks `fetch`, verifies credentials included, downloads blob from response

### `use-download-visualization.ts` (unit)

- `isDownloading` transitions: `false` → `true` on call start → `false` on success
- Error path: `false` → `true` → `false` after rejection, error toast shown

### `ArtifactVisualizationContainer.tsx` (component)

- Download button is present in the DOM after render
- Button is disabled when `isDownloading` is true
- For non-html types: button has opacity-0 class (hover-triggered)
- For html type: button has opacity-100 class (always visible)
