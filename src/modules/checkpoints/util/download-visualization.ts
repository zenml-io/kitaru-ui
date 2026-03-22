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
