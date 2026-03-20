import { useQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

export function useWaitCondition(waitConditionId: string | undefined) {
	const query = useQuery({
		...executionsQueries.waitCondition(waitConditionId ?? ""),
		enabled: !!waitConditionId,
	});

	return { ...query, waitConditionData: query.data };
}
