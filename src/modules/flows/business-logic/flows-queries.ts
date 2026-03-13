import { queryOptions } from "@tanstack/react-query";
import { fetchFlows } from "../domain/fetch-flows";

export const flowsQueryKeys = {
	all: ["flows"] as const,
};

export const flowsQueries = {
	all: () =>
		queryOptions({
			queryKey: flowsQueryKeys.all,
			queryFn: fetchFlows,
		}),
};
