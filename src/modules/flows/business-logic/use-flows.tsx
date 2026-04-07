import { useSuspenseQuery } from "@tanstack/react-query";
import { flowsQueries } from "./flows-queries";

type Options = Omit<
	ReturnType<typeof flowsQueries.all>,
	"queryKey" | "queryFn"
>;

export function useFlows(opts: Options = {}) {
	const query = useSuspenseQuery({
		...flowsQueries.all(),
		...opts,
	});

	return { ...query, flowsData: query.data };
}
