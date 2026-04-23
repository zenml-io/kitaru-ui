import type { Deployment } from "./deployment";

export const LOCAL_VERSION_ID = "local";

export function buildLocalDeployment(
	flowId: string,
	flowName: string
): Deployment {
	return {
		id: LOCAL_VERSION_ID,
		flowId,
		flowName,
		versionNumber: 0,
		tags: [],
		runnable: false,
		deployable: false,
	};
}

export function isLocalDeployment(deployment: Deployment | undefined): boolean {
	return deployment?.id === LOCAL_VERSION_ID;
}

export function withLocalDeployment(
	deployments: Deployment[],
	flowId: string,
	flowName: string
): Deployment[] {
	return [...deployments, buildLocalDeployment(flowId, flowName)];
}
