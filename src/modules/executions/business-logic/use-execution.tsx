import { useSuspenseQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

export function useExecution(executionId: string) {
	const query = useSuspenseQuery(executionsQueries.detail(executionId));

	return { ...query, executionData: query.data };
}
