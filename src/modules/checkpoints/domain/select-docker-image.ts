import type { DockerImage } from "@/modules/builds/domain/build";

export function selectDockerImage(
	images: Record<string, DockerImage>,
	checkpointName: string,
	stepOperator?: string
): DockerImage | null {
	if (stepOperator) {
		const compoundKey = `${checkpointName}.${stepOperator}`;
		const compoundHit = images[compoundKey];
		if (compoundHit !== undefined) return compoundHit;
	}
	const checkpointHit = images[checkpointName];
	if (checkpointHit !== undefined) return checkpointHit;
	const orchestratorHit = images.orchestrator;
	if (orchestratorHit !== undefined) return orchestratorHit;
	return null;
}
