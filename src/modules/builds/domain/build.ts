import type { components } from "@/shared/api/openapi";

type BuildItem = components["schemas"]["BuildItem"];
type PipelineBuildResponse = components["schemas"]["PipelineBuildResponse"];

export type DockerImage = {
	image: string;
	dockerfile?: string;
	requirements?: string;
	containsCode?: boolean;
	requiresCodeDownload?: boolean;
};

export type Build = {
	id: string;
	pythonVersion?: string;
	zenmlVersion?: string;
	isLocal?: boolean;
	containsCode?: boolean;
	images: Record<string, DockerImage>;
};

export function dockerImageFromApiToDomain(item: BuildItem): DockerImage {
	return {
		image: item.image,
		dockerfile: item.dockerfile ?? undefined,
		requirements: item.requirements ?? undefined,
		containsCode: item.contains_code,
		requiresCodeDownload: item.requires_code_download,
	};
}

export function buildFromApiToDomain(build: PipelineBuildResponse): Build {
	const apiImages = build.metadata?.images ?? {};
	const images: Record<string, DockerImage> = {};
	for (const [key, item] of Object.entries(apiImages)) {
		images[key] = dockerImageFromApiToDomain(item);
	}
	return {
		id: build.id,
		pythonVersion: build.metadata?.python_version ?? undefined,
		zenmlVersion: build.metadata?.zenml_version ?? undefined,
		isLocal: build.metadata?.is_local,
		containsCode: build.metadata?.contains_code,
		images,
	};
}
