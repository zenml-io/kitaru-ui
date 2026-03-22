import type { ArtifactVisualization } from "../domain/visualization";

const TEXT_TYPE_MAP: Record<string, { mime: string; ext: string }> = {
	json: { mime: "application/json", ext: ".json" },
	markdown: { mime: "text/markdown", ext: ".md" },
	html: { mime: "text/html", ext: ".html" },
	csv: { mime: "text/csv", ext: ".csv" },
};

const IMAGE_EXTENSIONS: Record<string, string> = {
	"image/png": ".png",
	"image/jpeg": ".jpg",
	"image/gif": ".gif",
	"image/webp": ".webp",
	"image/svg+xml": ".svg",
};

function mimeToImageExtension(mimeType: string): string {
	// Falls back to .png for unrecognised image MIME types (e.g. image/avif)
	return IMAGE_EXTENSIONS[mimeType] ?? ".png";
}

function triggerDownload(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	// Revoke after the browser has queued the download
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

	const config = TEXT_TYPE_MAP[visualization.type];
	const ext = config?.ext ?? "";
	const mime = config?.mime ?? "text/plain";
	const blob = new Blob([visualization.value], { type: mime });
	triggerDownload(blob, filename + ext);
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
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.status}`);
		}
		const blob = await response.blob();
		triggerDownload(blob, filename + mimeToImageExtension(blob.type));
	}
}
