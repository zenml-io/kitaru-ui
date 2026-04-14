import {
	keepPreviousData,
	useQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { FetchFlowsParams } from "../domain/fetch-flows";
import { flowsQueries } from "./flows-queries";

type SuspenseOptions = Omit<
	ReturnType<typeof flowsQueries.all>,
	"queryKey" | "queryFn"
>;

export function useFlows(opts: SuspenseOptions = {}) {
	const query = useSuspenseQuery({
		...flowsQueries.all(),
		...opts,
	});

	return { ...query, flowsData: query.data };
}

export function useFilteredFlows(
	params: FetchFlowsParams,
	opts: SuspenseOptions = {}
) {
	const query = useQuery({
		...flowsQueries.all(params),
		placeholderData: keepPreviousData,
		...opts,
	});

	return { ...query, flowsData: query.data ?? [] };
}
