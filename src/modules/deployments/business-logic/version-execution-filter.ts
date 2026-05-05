import type { ExecutionsScope } from "@/modules/executions/ui/ExecutionsScopeToggle";
import { LOCAL_VERSION_ID, type Deployment } from "../domain/deployment";

export type VersionExecutionFilter = {
	serverFilterSnapshotId: string | undefined;
	clientFilterRealSnapshotIds: Set<string> | undefined;
};

const NO_FILTER: VersionExecutionFilter = {
	serverFilterSnapshotId: undefined,
	clientFilterRealSnapshotIds: undefined,
};

export function executionsFilter(
	scope: ExecutionsScope,
	deployment: Deployment,
	realDeployments: Deployment[]
): VersionExecutionFilter {
	if (scope !== "version") return NO_FILTER;
	const isLocal = deployment.version === LOCAL_VERSION_ID;
	return {
		serverFilterSnapshotId: isLocal ? undefined : deployment.id,
		clientFilterRealSnapshotIds: isLocal
			? new Set(realDeployments.map((d) => d.id))
			: undefined,
	};
}
