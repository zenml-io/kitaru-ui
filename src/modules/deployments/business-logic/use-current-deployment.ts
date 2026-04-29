import { useLoaderData, useParams } from "@tanstack/react-router";
import type { Deployment } from "../domain/deployment";

const ROUTE_ID = "/_private/_navbar/flows/$flowId/v/$version" as const;

export type UseCurrentDeploymentResult = {
	flowId: string;
	deployment: Deployment;
};

export function useCurrentDeployment(): UseCurrentDeploymentResult {
	const { flowId } = useParams({ from: ROUTE_ID });
	const { deployment } = useLoaderData({ from: ROUTE_ID });
	return { flowId, deployment };
}
