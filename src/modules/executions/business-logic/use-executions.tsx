import { useSuspenseQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

export function useExecutions() {
	const query = useSuspenseQuery(executionsQueries.all());

	return { ...query, executionsData: query.data };
}
