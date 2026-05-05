import { useSuspenseQuery } from "@tanstack/react-query";
import { deploymentsQueries } from "./deployments-queries";

export function useDeployment(deploymentId: string) {
	return useSuspenseQuery(deploymentsQueries.detail(deploymentId));
}
