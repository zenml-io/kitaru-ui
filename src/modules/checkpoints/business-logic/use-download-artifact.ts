import { env } from "@/modules/root/domain/env";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchArtifactDownloadToken } from "../domain/fetch-artifact-download-token";

export function useDownloadArtifact() {
	const { mutate: download, isPending: isDownloading } = useMutation({
		mutationFn: async (artifactVersionId: string) => {
			const token = await fetchArtifactDownloadToken(artifactVersionId);
			const dataPath = `/api/v1/artifact_versions/${artifactVersionId}/data`;
			const params = new URLSearchParams({ token });

			const baseUrl = env.VITE_API_BASE_URL || env.VITE_BACKEND_URL || "";
			const url = `${baseUrl}${dataPath}?${params}`;

			window.open(url, "_blank");
		},
		onError: (error) => {
			toast.error("Download failed", {
				description: error.message,
			});
		},
	});

	return { download, isDownloading };
}
