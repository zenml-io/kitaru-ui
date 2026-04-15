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
	const query = useQuery({
		...checkpointsQueries.artifactVisualization(artifactVersionId),
		...opts,
	});
	return { ...query, visualizationData: query.data };
}
