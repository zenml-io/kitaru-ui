import { useLoaderData, useParams } from "@tanstack/react-router";
import type { Deployment } from "../domain/deployment";

const ROUTE_ID = "/_private/_navbar/flows/$flowId/v/$version" as const;

export type UseSelectedDeploymentResult = {
	flowId: string;
	selected: Deployment;
};

export function useSelectedDeployment(): UseSelectedDeploymentResult {
	const { flowId } = useParams({ from: ROUTE_ID });
	const { selected } = useLoaderData({ from: ROUTE_ID });
	return { flowId, selected };
}
