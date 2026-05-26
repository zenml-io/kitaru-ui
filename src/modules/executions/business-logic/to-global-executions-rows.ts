import {
	type DeploymentVersion,
	formatVersion,
	LOCAL_VERSION_ID,
} from "@/modules/deployments/domain/deployment";
import type { Execution, ExecutionStatus } from "../domain/execution";

export type GlobalExecutionsTableRow = {
	id: string;
	executionIndex: number;
	flowId?: string;
	flowName?: string;
	versionForLink: DeploymentVersion;
	versionLabel: string;
	stackName?: string;
	status?: ExecutionStatus;
	dateLabel: string;
	authorName: string;
	authorAvatarUrl?: string;
};

export function toGlobalExecutionsRows(
	executions: Execution[]
): GlobalExecutionsTableRow[] {
	return executions.map((execution) => {
		const version = execution.sourceSnapshot?.version ?? LOCAL_VERSION_ID;
		return {
			id: execution.id,
			executionIndex: execution.index,
			flowId: execution.flowId,
			flowName: execution.flowName,
			versionForLink: version,
			versionLabel: formatVersion(version),
			stackName: execution.stackName,
			status: execution.status,
			dateLabel: execution.createdAt?.toLocaleString() ?? "—",
			authorName: execution.user?.name ?? "",
			authorAvatarUrl: execution.user?.avatarUrl,
		};
	});
}
