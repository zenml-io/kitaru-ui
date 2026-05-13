import type {
	BuildImagesSet,
	DockerImage,
} from "@/modules/builds/domain/build";

export function selectDockerImage(
	images: BuildImagesSet,
	checkpointName: string,
	stepOperator?: string
): DockerImage | null {
	if (stepOperator) {
		const compoundHit =
			images.perStepOperator[`${checkpointName}.${stepOperator}`];
		if (compoundHit !== undefined) return compoundHit;
	}
	const checkpointHit = images.perStep[checkpointName];
	if (checkpointHit !== undefined) return checkpointHit;
	return images.orchestrator ?? null;
}
