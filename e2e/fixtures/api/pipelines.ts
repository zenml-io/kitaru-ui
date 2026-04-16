import type { components } from "@/shared/api/openapi";

type PipelineResponse = components["schemas"]["PipelineResponse"];
type PipelinePage = components["schemas"]["Page_PipelineResponse_"];

export function makePipeline(
	overrides: Partial<PipelineResponse> = {}
): PipelineResponse {
	return {
		id: "pipeline-1",
		name: "demo-pipeline",
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
