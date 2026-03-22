import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ArtifactVisualization } from "../domain/visualization";
import { downloadVisualization } from "../util/download-visualization";

export function useDownloadVisualization() {
	const [isDownloading, setIsDownloading] = useState(false);

	const download = useCallback(
		async (
			visualization: ArtifactVisualization,
			filename: string
		): Promise<void> => {
			setIsDownloading(true);
			try {
				await downloadVisualization(visualization, filename);
			} catch {
				toast.error("Failed to download artifact");
			} finally {
				setIsDownloading(false);
			}
		},
		[]
	);

	return { download, isDownloading };
}
