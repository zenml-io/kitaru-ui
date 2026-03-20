import { useSuspenseQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

export function useExecutions(flowId: string) {
	const query = useSuspenseQuery(executionsQueries.all(flowId));

	return { ...query, executionsData: query.data };
}
