import { useQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

type Options = Omit<
	ReturnType<typeof checkpointsQueries.artifactVersion>,
	"queryKey" | "queryFn"
>;

export function useArtifactVersion(
	artifactVersionId: string,
	opts: Options = {}
) {
	return useQuery({
		...checkpointsQueries.artifactVersion(artifactVersionId),
		...opts,
	});
}
