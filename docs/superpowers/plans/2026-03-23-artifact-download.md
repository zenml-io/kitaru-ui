# Artifact Download Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hover download button to artifact visualizations so users can save artifact content locally, reusing already-fetched visualization data.

**Architecture:** The download button is rendered as an absolute overlay (`top-2 right-2`) inside `ArtifactVisualizationContainer`, which wraps its output in a `relative group/viz` div. Text-based types (json, markdown, html, csv) download synchronously from cached data via Blob → object URL; images are fetched via `fetch` with credentials. For `html` type the button is always visible (opacity-100) because the iframe consumes pointer events from the parent group.

**Tech Stack:** React 19, TypeScript, Vitest 4 (node environment), Tailwind CSS v4, `sonner` for toasts, `@untitledui/icons` for the Download01 icon.

---

## File Map

| Action | File                                                                   | Responsibility                                                     |
| ------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Create | `src/modules/checkpoints/util/download-visualization.ts`               | Pure async utility: maps visualization type → Blob/fetch download  |
| Create | `src/modules/checkpoints/util/download-visualization.test.ts`          | Unit tests for the utility (mocks browser globals)                 |
| Create | `src/modules/checkpoints/business-logic/use-download-visualization.ts` | React hook: wraps utility with `isDownloading` state + error toast |
| Modify | `src/modules/checkpoints/feature/ArtifactVisualizationContainer.tsx`   | Add `filename` prop, relative wrapper, overlay download button     |
| Modify | `src/modules/executions/ui/traces/CheckpointRowArtifacts.tsx`          | Pass `filename={selected.entry.name}` to container                 |
| Modify | `src/modules/checkpoints/ui/CheckpointDetailPanelArtifacts.tsx`        | Pass `filename={selectedArtifact.artifact.name}` to container      |

---

## Task 1: Download utility — tests

**Files:**

- Create: `src/modules/checkpoints/util/download-visualization.test.ts`

The `util/` directory does not yet exist — create it alongside this file.

Tests run in Vitest's default Node environment. Browser globals (`document`, `URL`, `fetch`) must be stubbed with `vi.stubGlobal`. Each test stubs a mock anchor element, asserts the correct Blob MIME type, filename extension, and that `click()` was called.

- [ ] **Step 1: Create the test file with stubs and one failing test**

```typescript
// src/modules/checkpoints/util/download-visualization.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ArtifactVisualization } from "../domain/visualization";
import { downloadVisualization } from "./download-visualization";

describe("downloadVisualization", () => {
	let anchor: {
		click: ReturnType<typeof vi.fn>;
		href: string;
		download: string;
	};

	beforeEach(() => {
		anchor = { click: vi.fn(), href: "", download: "" };

		vi.stubGlobal("document", {
			createElement: vi.fn().mockReturnValue(anchor),
			body: {
				appendChild: vi.fn(),
				removeChild: vi.fn(),
			},
		});

		vi.stubGlobal("URL", {
			createObjectURL: vi.fn().mockReturnValue("blob:mock-url"),
			revokeObjectURL: vi.fn(),
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	it("downloads json with correct MIME type and .json extension", async () => {
		const viz: ArtifactVisualization = {
			type: "json",
			value: '{"foo":"bar"}',
		};
		const promise = downloadVisualization(viz, "my_artifact");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "application/json" })
		);
		expect(anchor.download).toBe("my_artifact.json");
		expect(anchor.click).toHaveBeenCalled();
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
	});

	it("downloads markdown with .md extension", async () => {
		const viz: ArtifactVisualization = { type: "markdown", value: "# Hello" };
		const promise = downloadVisualization(viz, "report");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "text/markdown" })
		);
		expect(anchor.download).toBe("report.md");
	});

	it("downloads html with .html extension", async () => {
		const viz: ArtifactVisualization = {
			type: "html",
			value: "<h1>Hi</h1>",
		};
		const promise = downloadVisualization(viz, "page");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "text/html" })
		);
		expect(anchor.download).toBe("page.html");
	});

	it("downloads csv with .csv extension", async () => {
		const viz: ArtifactVisualization = {
			type: "csv",
			value: "a,b\n1,2",
		};
		const promise = downloadVisualization(viz, "data");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "text/csv" })
		);
		expect(anchor.download).toBe("data.csv");
	});

	it("downloads image data URL by decoding base64", async () => {
		// Minimal 1x1 transparent PNG in base64
		const base64 =
			"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
		const viz: ArtifactVisualization = {
			type: "image",
			value: `data:image/png;base64,${base64}`,
		};
		const promise = downloadVisualization(viz, "photo");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "image/png" })
		);
		expect(anchor.download).toBe("photo.png");
		expect(anchor.click).toHaveBeenCalled();
	});

	it("downloads image URL by fetching with credentials, extension from blob MIME type", async () => {
		const mockBlob = new Blob(["fake-image"], { type: "image/jpeg" });
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ blob: () => Promise.resolve(mockBlob) })
		);

		const viz: ArtifactVisualization = {
			type: "image",
			value: "/api/v1/some-image-url",
		};
		const promise = downloadVisualization(viz, "photo");
		await promise;
		vi.runAllTimers();

		expect(fetch).toHaveBeenCalledWith("/api/v1/some-image-url", {
			credentials: "include",
		});
		expect(anchor.download).toBe("photo.jpg");
		expect(anchor.click).toHaveBeenCalled();
	});
});
```

- [ ] **Step 2: Run tests to confirm they all fail**

```bash
pnpm test:unit run src/modules/checkpoints/util/download-visualization.test.ts
```

Expected: all 6 tests fail with "Cannot find module './download-visualization'"

---

## Task 2: Download utility — implementation

**Files:**

- Create: `src/modules/checkpoints/util/download-visualization.ts`

- [ ] **Step 1: Implement the utility**

```typescript
// src/modules/checkpoints/util/download-visualization.ts
import type { ArtifactVisualization } from "../domain/visualization";

const MIME_TYPES: Record<string, string> = {
	json: "application/json",
	markdown: "text/markdown",
	html: "text/html",
	csv: "text/csv",
};

const TEXT_EXTENSIONS: Record<string, string> = {
	json: ".json",
	markdown: ".md",
	html: ".html",
	csv: ".csv",
};

const IMAGE_EXTENSIONS: Record<string, string> = {
	"image/png": ".png",
	"image/jpeg": ".jpg",
	"image/gif": ".gif",
	"image/webp": ".webp",
	"image/svg+xml": ".svg",
};

function mimeToImageExtension(mimeType: string): string {
	return IMAGE_EXTENSIONS[mimeType] ?? ".png";
}

function triggerDownload(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}, 0);
}

export async function downloadVisualization(
	visualization: ArtifactVisualization,
	filename: string
): Promise<void> {
	if (visualization.type === "image") {
		await downloadImage(visualization.value, filename);
		return;
	}

	const extension = TEXT_EXTENSIONS[visualization.type] ?? "";
	const mimeType = MIME_TYPES[visualization.type] ?? "text/plain";
	const blob = new Blob([visualization.value], { type: mimeType });
	triggerDownload(blob, filename + extension);
}

async function downloadImage(value: string, filename: string): Promise<void> {
	if (value.startsWith("data:")) {
		const mimeType = value.slice(5, value.indexOf(";"));
		const base64 = value.slice(value.lastIndexOf(",") + 1);
		const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
		const blob = new Blob([bytes], { type: mimeType });
		triggerDownload(blob, filename + mimeToImageExtension(mimeType));
	} else {
		const response = await fetch(value, { credentials: "include" });
		const blob = await response.blob();
		triggerDownload(blob, filename + mimeToImageExtension(blob.type));
	}
}
```

- [ ] **Step 2: Run tests to confirm they all pass**

```bash
pnpm test:unit run src/modules/checkpoints/util/download-visualization.test.ts
```

Expected: 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/modules/checkpoints/util/download-visualization.ts src/modules/checkpoints/util/download-visualization.test.ts
git commit -m "feat: add download-visualization utility"
```

---

## Task 3: Download hook

**Files:**

- Create: `src/modules/checkpoints/business-logic/use-download-visualization.ts`

The hook wraps the utility with `isDownloading` state and an error toast. No additional tests — the utility tests cover the core logic; the hook is a thin state wrapper.

- [ ] **Step 1: Implement the hook**

```typescript
// src/modules/checkpoints/business-logic/use-download-visualization.ts
import { useState } from "react";
import { toast } from "sonner";
import type { ArtifactVisualization } from "../domain/visualization";
import { downloadVisualization } from "../util/download-visualization";

export function useDownloadVisualization() {
	const [isDownloading, setIsDownloading] = useState(false);

	async function download(
		visualization: ArtifactVisualization,
		filename: string
	): Promise<void> {
		setIsDownloading(true);
		try {
			await downloadVisualization(visualization, filename);
		} catch {
			toast.error("Failed to download artifact");
		} finally {
			setIsDownloading(false);
		}
	}

	return { download, isDownloading };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm check:types
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/checkpoints/business-logic/use-download-visualization.ts
git commit -m "feat: add useDownloadVisualization hook"
```

---

## Task 4: Update ArtifactVisualizationContainer

**Files:**

- Modify: `src/modules/checkpoints/feature/ArtifactVisualizationContainer.tsx`

Current file (read before editing):

```typescript
// src/modules/checkpoints/feature/ArtifactVisualizationContainer.tsx
import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { VisualizationViewer } from "@/modules/executions/ui/traces/VisualizationViewer";

interface ArtifactVisualizationContainerProps {
  artifactVersionId: string;
}

export function ArtifactVisualizationContainer({
  artifactVersionId,
}: ArtifactVisualizationContainerProps) {
  const { visualizationData } = useArtifactVisualization(artifactVersionId);
  return <VisualizationViewer artifact={visualizationData} />;
}
```

Replace it with:

- [ ] **Step 1: Update the container**

```typescript
// src/modules/checkpoints/feature/ArtifactVisualizationContainer.tsx
import { useDownloadVisualization } from "../business-logic/use-download-visualization";
import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { VisualizationViewer } from "@/modules/executions/ui/traces/VisualizationViewer";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/styles";
import { Download01 } from "@untitledui/icons";

interface ArtifactVisualizationContainerProps {
  artifactVersionId: string;
  filename: string;
}

export function ArtifactVisualizationContainer({
  artifactVersionId,
  filename,
}: ArtifactVisualizationContainerProps) {
  const { visualizationData } = useArtifactVisualization(artifactVersionId);
  const { download, isDownloading } = useDownloadVisualization();

  const isHtml = visualizationData.type === "html";

  return (
    <div className="group/viz relative">
      <VisualizationViewer artifact={visualizationData} />
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          "absolute top-2 right-2 z-10 transition-opacity",
          isHtml ? "opacity-100" : "opacity-0 group-hover/viz:opacity-100"
        )}
        disabled={isDownloading}
        onClick={() => download(visualizationData, filename)}
      >
        <Download01 className="text-muted-foreground h-3.5 w-3.5" />
        <span className="sr-only">Download artifact</span>
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm check:types
```

Expected: no errors. If `Download01` is not found, verify the icon name with: `node -e "const icons = require('@untitledui/icons'); console.log(Object.keys(icons).filter(k => k.includes('Download')))"`.

- [ ] **Step 3: Commit**

```bash
git add src/modules/checkpoints/feature/ArtifactVisualizationContainer.tsx
git commit -m "feat: add download overlay button to ArtifactVisualizationContainer"
```

---

## Task 5: Wire call sites

**Files:**

- Modify: `src/modules/executions/ui/traces/CheckpointRowArtifacts.tsx` (line ~94)
- Modify: `src/modules/checkpoints/ui/CheckpointDetailPanelArtifacts.tsx` (line ~43)

Both call sites currently pass only `artifactVersionId` to `ArtifactVisualizationContainer`. Add `filename` from the already-available `selected.entry.name` / `selectedArtifact.artifact.name`.

- [ ] **Step 1: Update CheckpointRowArtifacts**

Find the `ArtifactVisualizationContainer` usage (around line 94) and add the `filename` prop:

```tsx
<ArtifactVisualizationContainer
	artifactVersionId={selected.entry.id}
	filename={selected.entry.name}
/>
```

- [ ] **Step 2: Update CheckpointDetailPanelArtifacts**

Find the `ArtifactVisualizationContainer` usage (around line 43) and add the `filename` prop:

```tsx
<ArtifactVisualizationContainer
	artifactVersionId={selectedArtifact.artifact.id}
	filename={selectedArtifact.artifact.name}
/>
```

- [ ] **Step 3: Verify TypeScript compiles with no errors**

```bash
pnpm check:types
```

Expected: no errors.

- [ ] **Step 4: Run all unit tests**

```bash
pnpm test:unit run
```

Expected: all tests pass.

- [ ] **Step 5: Manually verify in the browser**

1. Navigate to any execution with artifacts (e.g. `http://localhost:5174/flows/<flowId>/executions/<executionId>`)
2. Click on a checkpoint that has artifacts
3. Expand the inline trace row — hover over the visualization → download button appears in top-right corner
4. Click download → file saves locally with the correct extension and name
5. Open the right panel Artifacts tab → same button appears on hover
6. For an `html`-type artifact (if available) → button is always visible without hovering
7. Check that the downloaded file content matches what was displayed

- [ ] **Step 6: Commit**

```bash
git add src/modules/executions/ui/traces/CheckpointRowArtifacts.tsx src/modules/checkpoints/ui/CheckpointDetailPanelArtifacts.tsx
git commit -m "feat: wire artifact download to both visualization call sites"
```
