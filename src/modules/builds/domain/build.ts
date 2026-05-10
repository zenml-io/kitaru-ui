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

export type BuildImages = {
	orchestrator?: DockerImage;
	perStep: Record<string, DockerImage>;
	perStepOperator: Record<string, DockerImage>;
};

export type Build = {
	id: string;
	pythonVersion?: string;
	zenmlVersion?: string;
	isLocal?: boolean;
	images: BuildImages;
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

function partitionBuildImages(
	apiImages: Record<string, BuildItem>
): BuildImages {
	const images: BuildImages = {
		perStep: {},
		perStepOperator: {},
	};
	for (const [key, item] of Object.entries(apiImages)) {
		const dockerImage = dockerImageFromApiToDomain(item);
		if (key === "orchestrator") {
			images.orchestrator = dockerImage;
		} else if (key.includes(".")) {
			images.perStepOperator[key] = dockerImage;
		} else {
			images.perStep[key] = dockerImage;
		}
	}
	return images;
}

export function buildFromApiToDomain(build: PipelineBuildResponse): Build {
	return {
		id: build.id,
		pythonVersion: build.metadata?.python_version ?? undefined,
		zenmlVersion: build.metadata?.zenml_version ?? undefined,
		isLocal: build.metadata?.is_local,
		images: partitionBuildImages(build.metadata?.images ?? {}),
	};
}
