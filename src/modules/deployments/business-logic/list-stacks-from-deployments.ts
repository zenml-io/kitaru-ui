import type { Deployment } from "../domain/deployment";

export type DeploymentStackRef = {
	id: string;
	name: string;
};

export function listStacksFromDeployments(
	deployments: Deployment[]
): DeploymentStackRef[] {
	const byId = new Map<string, string>();
	for (const d of deployments) {
		if (d.stackId && d.stackName) byId.set(d.stackId, d.stackName);
	}
	return Array.from(byId, ([id, name]) => ({ id, name }));
}
