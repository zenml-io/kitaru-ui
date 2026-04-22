import { queryOptions } from "@tanstack/react-query";
import { fetchDeployments } from "../domain/fetch-deployments";
import { fetchDeployment } from "../domain/fetch-deployment";

export const deploymentsQueryKeys = {
	base: ["deployments"] as const,
	list: (flowId: string) =>
		[...deploymentsQueryKeys.base, "list", flowId] as const,
	detail: (snapshotId: string) =>
		[...deploymentsQueryKeys.base, "detail", snapshotId] as const,
};

export const deploymentsQueries = {
	list: (flowId: string) =>
		queryOptions({
			queryKey: deploymentsQueryKeys.list(flowId),
			queryFn: () => fetchDeployments(flowId),
		}),
	detail: (snapshotId: string) =>
		queryOptions({
			queryKey: deploymentsQueryKeys.detail(snapshotId),
			queryFn: () => fetchDeployment(snapshotId),
		}),
};
