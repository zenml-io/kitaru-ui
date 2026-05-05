import type { DockerImage } from "@/modules/builds/domain/build";

export function selectDockerImage(
	images: Record<string, DockerImage>,
	checkpointName: string,
	stepOperator?: string
): DockerImage | null {
	if (stepOperator) {
		const compoundKey = `${checkpointName}.${stepOperator}`;
		if (images[compoundKey]) return images[compoundKey];
	}
	if (images[checkpointName]) return images[checkpointName];
	if (images.orchestrator) return images.orchestrator;
	return null;
}
