import { useQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

type Options = Omit<
	ReturnType<typeof checkpointsQueries.visualization>,
	"queryKey" | "queryFn"
>;

export function useArtifactVisualization(
	artifactVersionId: string,
	opts: Options = {}
) {
	const query = useQuery({
		...checkpointsQueries.visualization(artifactVersionId),
		...opts,
	});
	return { ...query, visualizationData: query.data };
}
