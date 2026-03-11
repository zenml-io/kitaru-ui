import { useSuspenseQuery } from "@tanstack/react-query";
import { flowsQueries } from "./flows-queries";

export function useFlows() {
	const query = useSuspenseQuery(flowsQueries.all());

	return { ...query, flowRows: query.data };
}
