import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";
import type { Checkpoint } from "../domain/checkpoint";
import { getIsActiveStatus } from "@/shared/business-logic/status";

export function getCheckpointDetailsPollingInterval(query: {
	state: { data?: Checkpoint };
}) {
	return getIsActiveStatus(query.state.data?.status) ? 3000 : false;
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
