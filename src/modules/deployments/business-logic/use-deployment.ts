import { useSuspenseQuery } from "@tanstack/react-query";
import { deploymentsQueries } from "./deployments-queries";

export function useDeployment(snapshotId: string) {
	return useSuspenseQuery(deploymentsQueries.detail(snapshotId));
}
