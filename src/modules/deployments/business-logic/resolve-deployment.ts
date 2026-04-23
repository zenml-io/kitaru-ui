import type { Execution } from "@/modules/executions/domain/execution";
import type { Deployment } from "../domain/deployment";

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
	version: number | "local" | undefined
): Deployment | undefined {
	if (deployments.length === 0) return undefined;
	if (version === "local") {
		const local = deployments.find((d) => d.id === "local");
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
	return execution.snapshotId
		? deployments.find((d) => d.id === execution.snapshotId)
		: undefined;
}
