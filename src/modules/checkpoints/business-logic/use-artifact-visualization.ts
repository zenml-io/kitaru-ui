import { useQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

type Options = Omit<
	ReturnType<typeof checkpointsQueries.artifactVisualization>,
	"queryKey" | "queryFn"
>;

export function useArtifactVisualization(
	artifactVersionId: string,
	opts: Options = {}
) {
	return useQuery({
		...checkpointsQueries.artifactVisualization(artifactVersionId),
		...opts,
	});
}
