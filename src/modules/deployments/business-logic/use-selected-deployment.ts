import { useLoaderData, useParams } from "@tanstack/react-router";
import type { Flow } from "@/modules/flows/domain/flow";
import type { Deployment } from "../domain/deployment";

const ROUTE_ID = "/_private/_navbar/flows/$flowId/v/$version" as const;

export type UseSelectedDeploymentResult = {
	flowId: string;
	flow: Flow;
	selected: Deployment;
};

export function useSelectedDeployment(): UseSelectedDeploymentResult {
	const { flowId } = useParams({ from: ROUTE_ID });
	const { flow, selected } = useLoaderData({ from: ROUTE_ID });
	return { flowId, flow, selected };
}
