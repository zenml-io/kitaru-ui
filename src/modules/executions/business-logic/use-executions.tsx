import { useSuspenseQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

type Options = Omit<
	ReturnType<typeof executionsQueries.all>,
	"queryKey" | "queryFn"
> & {
	snapshotId?: string;
};

export function useExecutions(flowId: string, opts: Options = {}) {
	const { snapshotId, ...queryOpts } = opts;
	const query = useSuspenseQuery({
		...executionsQueries.all(flowId, snapshotId),
		...queryOpts,
	});

	return { ...query, executionsData: query.data };
}
