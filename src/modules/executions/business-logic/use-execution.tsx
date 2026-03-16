import { useSuspenseQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

export function useExecution(execId: string) {
	const query = useSuspenseQuery(executionsQueries.detail(execId));

	return { ...query, executionData: query.data };
}
