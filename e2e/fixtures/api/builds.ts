import type { components } from "@/shared/api/openapi";

type PipelineBuildResponse = components["schemas"]["PipelineBuildResponse"];
type PipelineBuildResponseMetadata =
	components["schemas"]["PipelineBuildResponseMetadata"];
type BuildItem = components["schemas"]["BuildItem"];

const DEFAULT_BUILD_ID = "77777777-7777-7777-7777-777777777777";

type BuildOverrides = Partial<Omit<PipelineBuildResponse, "metadata">> & {
	metadata?: Partial<PipelineBuildResponseMetadata>;
};

export function makeBuildItem(overrides: Partial<BuildItem> = {}): BuildItem {
	return {
		image: "docker.io/zenml-io/zenml@sha256:abcd",
		dockerfile: 'FROM python:3.11\nRUN pip install zenml\nCMD ["bash"]',
		requirements: "zenml==0.65.0\nscikit-learn==1.4.0",
		contains_code: true,
		requires_code_download: false,
		...overrides,
	};
}

export function makeBuild(
	overrides: BuildOverrides = {}
): PipelineBuildResponse {
	const { metadata: metadataOverrides, ...rest } = overrides;
	return {
		id: DEFAULT_BUILD_ID,
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
			project_id: "00000000-0000-0000-0000-000000000000",
		},
		metadata: {
			is_local: false,
			contains_code: true,
			python_version: "3.11.7",
			zenml_version: "0.65.0",
			images: {
				orchestrator: makeBuildItem(),
			},
			...metadataOverrides,
		},
		...rest,
	};
}
