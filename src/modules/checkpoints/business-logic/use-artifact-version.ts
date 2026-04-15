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
	const query = useQuery({
		...checkpointsQueries.artifactVersion(artifactVersionId),
		...opts,
	});
	return { ...query, artifactVersion: query.data };
}
