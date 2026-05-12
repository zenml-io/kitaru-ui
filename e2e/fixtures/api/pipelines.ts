import type { components } from "@/shared/api/openapi";

type PipelineResponse = components["schemas"]["PipelineResponse"];
type PipelinePage = components["schemas"]["Page_PipelineResponse_"];

export function makePipeline(
	overrides: Partial<PipelineResponse> = {}
): PipelineResponse {
	return {
		id: "00000000-0000-0000-0000-000000000002",
		name: "demo-pipeline",
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
			project_id: "00000000-0000-0000-0000-000000000010",
		},
		...overrides,
	};
}

export function makePipelinePage(items: PipelineResponse[] = []): PipelinePage {
	return {
		index: 1,
		max_size: 1000,
		total_pages: 1,
		total: items.length,
		items,
	};
}
