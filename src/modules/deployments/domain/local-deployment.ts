import type { Deployment } from "./deployment";

export const LOCAL_VERSION_ID = "local";

export type LocalDeployment = Deployment & {
	id: typeof LOCAL_VERSION_ID;
	runnable: false;
	deployable: false;
};

export function buildLocalDeployment(
	flowId: string,
	flowName: string
): LocalDeployment {
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

export function isLocalDeployment(
	deployment: Deployment | undefined
): deployment is LocalDeployment {
	return deployment?.id === LOCAL_VERSION_ID;
}

export function withLocalDeployment(
	deployments: Deployment[],
	flowId: string,
	flowName: string
): Deployment[] {
	return [...deployments, buildLocalDeployment(flowId, flowName)];
}
