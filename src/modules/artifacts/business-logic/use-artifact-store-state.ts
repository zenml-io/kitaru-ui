import { useArtifactVersion } from "@/modules/checkpoints/business-logic/use-artifact-version";
import { classifyArtifactStore } from "./classify-artifact-store";
import { useArtifactStore } from "./use-artifact-store";

export function useArtifactStoreState(artifactVersionId: string) {
	const versionQuery = useArtifactVersion(artifactVersionId);
	const artifactStoreId =
		versionQuery.data?.body?.artifact_store_id ?? undefined;

	const storeQuery = useArtifactStore(artifactStoreId ?? "", {
		enabled: !!artifactStoreId,
	});

	const state = classifyArtifactStore({
		artifactStore: storeQuery.data,
		uri: versionQuery.data?.body?.uri,
	});

	const isPending =
		versionQuery.isPending || (!!artifactStoreId && storeQuery.isPending);

	return {
		state,
		storeError: storeQuery.error ?? null,
		isPending,
	};
}
