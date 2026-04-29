import type { Deployment, DeploymentTag } from "../domain/deployment";
import { isLocalDeployment } from "../domain/local-deployment";

export type CategorizedDeployments = {
	selected: Deployment;
	selectedDefaultTag: DeploymentTag | undefined;
	defaultHolder: Deployment | undefined;
	restRealVersions: Deployment[];
	localEntry: Deployment | undefined;
};

export function categorizeDeployments(
	deployments: Deployment[],
	selectedId: string | undefined
): CategorizedDeployments | undefined {
	if (deployments.length === 0) return undefined;
	const selected =
		deployments.find((d) => d.id === selectedId) ?? deployments[0];
	const selectedDefaultTag = selected.tags.find((t) => t.kind === "default");
	const defaultHolder = deployments.find((d) =>
		d.tags.some((t) => t.kind === "default")
	);
	const localEntry = deployments.find(isLocalDeployment);
	const restRealVersions = deployments.filter(
		(d) => d.id !== defaultHolder?.id && !isLocalDeployment(d)
	);
	return {
		selected,
		selectedDefaultTag,
		defaultHolder,
		restRealVersions,
		localEntry,
	};
}
