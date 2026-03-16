import { useSuspenseQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

export function useSteps(execId: string) {
	const query = useSuspenseQuery(executionsQueries.steps(execId));

	return { ...query, stepsData: query.data };
}
