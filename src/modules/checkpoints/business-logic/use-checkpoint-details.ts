import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

type Options = Omit<
	ReturnType<typeof checkpointsQueries.details>,
	"queryKey" | "queryFn"
>;

export function useCheckpointDetails(checkpointId: string, opts: Options = {}) {
	const query = useSuspenseQuery({
		...checkpointsQueries.details(checkpointId),
		...opts,
	});

	return { ...query, detailsData: query.data };
}
