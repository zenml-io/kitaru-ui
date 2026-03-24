import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";
import type { Checkpoint } from "../domain/checkpoint";

export function getCheckpointDetailsPollingInterval(query: {
	state: { data?: Checkpoint };
}) {
	return query.state.data?.status === "running" ? 3000 : false;
}

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
