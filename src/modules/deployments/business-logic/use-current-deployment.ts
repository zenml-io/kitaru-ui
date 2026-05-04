import { getRouteApi } from "@tanstack/react-router";
import type { Deployment } from "../domain/deployment";

const route = getRouteApi("/_private/_navbar/flows/$flowId/v/$version");

export type UseCurrentDeploymentResult = {
	flowId: string;
	deployment: Deployment;
};

export function useCurrentDeployment(): UseCurrentDeploymentResult {
	const { flowId } = route.useParams();
	const { deployment } = route.useLoaderData();
	return { flowId, deployment };
}
