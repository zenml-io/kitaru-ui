/**
 * Triggers a client-side file download of the given text content via a Blob
 * URL. The object URL is always revoked after the click is dispatched.
 */
export function downloadTextFile(
	filename: string,
	content: string,
	mimeType = "text/plain"
): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	try {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	} finally {
		URL.revokeObjectURL(url);
	}
}
