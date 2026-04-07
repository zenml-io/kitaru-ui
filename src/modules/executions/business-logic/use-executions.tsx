import { useSuspenseQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

type Options = Omit<
	ReturnType<typeof executionsQueries.all>,
	"queryKey" | "queryFn"
>;

export function useExecutions(flowId: string, opts: Options = {}) {
	const query = useSuspenseQuery({
		...executionsQueries.all(flowId),
		...opts,
	});

	return { ...query, executionsData: query.data };
}
