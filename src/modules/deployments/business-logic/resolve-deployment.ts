import type { Execution } from "@/modules/executions/domain/execution";
import type { Deployment } from "../domain/deployment";
import {
	isLocalDeployment,
	LOCAL_VERSION_ID,
} from "../domain/local-deployment";

export function resolveDefaultDeployment(
	deployments: Deployment[]
): Deployment | undefined {
	return deployments.find((d) => d.tags.some((t) => t.name === "default"));
}

export function resolveDeploymentByVersion(
	deployments: Deployment[],
	version: number
): Deployment | undefined {
	return deployments.find((d) => d.versionNumber === version);
}

export function resolveDeploymentByExclusiveTag(
	deployments: Deployment[],
	tagName: string
): Deployment | undefined {
	return deployments.find((d) =>
		d.tags.some(
			(t) =>
				t.name === tagName && (t.kind === "exclusive" || t.kind === "default")
		)
	);
}

export function resolveSelectedDeployment(
	deployments: Deployment[],
	version: number | typeof LOCAL_VERSION_ID | undefined
): Deployment | undefined {
	if (deployments.length === 0) return undefined;
	if (version === LOCAL_VERSION_ID) {
		const local = deployments.find(isLocalDeployment);
		if (local) return local;
	} else if (version !== undefined) {
		const byVersion = resolveDeploymentByVersion(deployments, version);
		if (byVersion) return byVersion;
	}
	return resolveDefaultDeployment(deployments) ?? deployments[0];
}

export function resolveDeploymentForExecution(
	execution: Execution,
	deployments: Deployment[]
): Deployment | undefined {
	return execution.sourceSnapshotId
		? deployments.find((d) => d.id === execution.sourceSnapshotId)
		: undefined;
}
