import { useSuspenseQuery } from "@tanstack/react-query";
import { deploymentsQueries } from "./deployments-queries";

export function useDeployments(flowId: string) {
	return useSuspenseQuery(deploymentsQueries.list(flowId));
}
