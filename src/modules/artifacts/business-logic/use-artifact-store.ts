import { useQuery } from "@tanstack/react-query";
import { artifactStoresQueries } from "./artifact-stores-queries";

type Options = Omit<
	ReturnType<typeof artifactStoresQueries.detail>,
	"queryKey" | "queryFn"
>;

export function useArtifactStore(componentId: string, opts: Options = {}) {
	return useQuery({
		...artifactStoresQueries.detail(componentId),
		...opts,
	});
}
