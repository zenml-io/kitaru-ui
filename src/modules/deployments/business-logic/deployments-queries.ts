import { queryOptions } from "@tanstack/react-query";
import { fetchDeployment } from "../domain/fetch-deployment";
import { fetchDeploymentByVersion } from "../domain/fetch-deployment-by-version";
import { fetchDeployments } from "../domain/fetch-deployments";

export const deploymentsQueryKeys = {
	base: ["deployments"] as const,
	list: (flowId: string) =>
		[...deploymentsQueryKeys.base, "list", flowId] as const,
	detail: (snapshotId: string) =>
		[...deploymentsQueryKeys.base, "detail", snapshotId] as const,
	byVersion: (flowId: string, version: number) =>
		[...deploymentsQueryKeys.base, "byVersion", flowId, version] as const,
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
	byVersion: (flowId: string, flowName: string, version: number) =>
		queryOptions({
			queryKey: deploymentsQueryKeys.byVersion(flowId, version),
			queryFn: () => fetchDeploymentByVersion(flowId, flowName, version),
		}),
};
