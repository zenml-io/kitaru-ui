import { useQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

type Options = Omit<
	ReturnType<typeof checkpointsQueries.version>,
	"queryKey" | "queryFn"
>;

export function useArtifactVersion(
	artifactVersionId: string,
	opts: Options = {}
) {
	const query = useQuery({
		...checkpointsQueries.version(artifactVersionId),
		...opts,
	});
	return { ...query, artifactVersion: query.data };
}
