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
	return deployments.find((d) => d.version === version);
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
