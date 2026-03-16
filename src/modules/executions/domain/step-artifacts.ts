import type { components } from "@/shared/api/openapi";
import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

export type StepArtifacts = {
	inputs: Record<string, unknown>;
	outputs: Record<string, unknown>;
};

export async function fetchStepArtifacts(
	stepId: string
): Promise<StepArtifacts> {
	const response = await apiClient.GET("/api/v1/steps/{step_id}", {
		params: {
			path: { step_id: stepId },
			query: { hydrate: true },
		},
	});
	const step = expectData(
		response
	) as components["schemas"]["StepRunResponse"] & {
		resources?: components["schemas"]["StepRunResponseResources"] | null;
	};

	return {
		inputs: (step.resources?.inputs as Record<string, unknown>) ?? {},
		outputs: (step.resources?.outputs as Record<string, unknown>) ?? {},
	};
}
