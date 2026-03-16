import { useSuspenseQuery } from "@tanstack/react-query";
import { flowsQueries } from "./flows-queries";

export function useFlow(flowId: string) {
	const query = useSuspenseQuery(flowsQueries.detail(flowId));

	return { ...query, flowData: query.data };
}
