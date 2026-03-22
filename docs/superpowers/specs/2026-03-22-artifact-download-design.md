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

Pure async utility. Takes `visualization: ArtifactVisualization` and `filename: string`, triggers a browser file download.

**Per type:**

| Type                  | Strategy                                                          | MIME type             |
| --------------------- | ----------------------------------------------------------------- | --------------------- |
| `json`                | `Blob(value)` → object URL → `<a download>`                       | `application/json`    |
| `markdown`            | `Blob(value)` → object URL → `<a download>`                       | `text/markdown`       |
| `html`                | `Blob(value)` → object URL → `<a download>`                       | `text/html`           |
| `csv`                 | `Blob(value)` → object URL → `<a download>`                       | `text/csv`            |
| `image` (data URL)    | Parse base64, decode to `Blob`, download                          | from data URL prefix  |
| `image` (regular URL) | `fetch(value, { credentials: 'include' })` → `.blob()` → download | from response headers |

Object URLs are revoked after use.

### New: `src/modules/checkpoints/business-logic/use-download-visualization.ts`

Hook that wraps `downloadVisualization` with UI state.

```
{ download(visualization, filename): void, isDownloading: boolean }
```

- Sets `isDownloading = true` before calling the utility
- Sets `isDownloading = false` after completion or on error
- On error: shows an error toast, resets state

### Modified: `src/modules/checkpoints/feature/ArtifactVisualizationContainer.tsx`

- Add `filename: string` prop
- Wrap `VisualizationViewer` in a `relative group/viz` div
- Render an overlay download `Button` (variant `ghost`, size `icon-sm`):
  - Positioned `absolute top-2 right-2`
  - `opacity-0 group-hover/viz:opacity-100 transition-opacity`
  - `disabled` when `isDownloading`
  - Uses `Download01` icon from `@untitledui/icons`

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
