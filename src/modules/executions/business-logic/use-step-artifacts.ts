import { useQuery } from "@tanstack/react-query";
import { executionsQueries } from "./executions-queries";

export function useStepArtifacts(stepId: string | null) {
	const query = useQuery({
		...executionsQueries.stepArtifacts(stepId ?? ""),
		enabled: !!stepId,
	});

	return { ...query, artifactsData: query.data ?? null };
}
