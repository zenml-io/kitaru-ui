import { useSuspenseQuery } from "@tanstack/react-query";
import { buildsQueries } from "@/modules/builds/business-logic/builds-queries";
import { deriveRegistryUrl } from "@/modules/builds/business-logic/derive-registry-url";
import { selectDockerImage } from "../domain/select-docker-image";
import { DockerImageSection } from "../ui/configuration/DockerImageSection";

type Props = {
	buildId: string;
	checkpointName: string;
	checkpointStepOperator?: string;
};

export function CheckpointDockerImageSectionContainer({
	buildId,
	checkpointName,
	checkpointStepOperator,
}: Props) {
	const { data: build } = useSuspenseQuery(buildsQueries.detail(buildId));
	const dockerImage = selectDockerImage(
		build.imagesSet,
		checkpointName,
		checkpointStepOperator
	);
	if (!dockerImage) {
		console.warn("[CheckpointDockerImageSection] no matching Docker image", {
			buildId,
			checkpointName,
			checkpointStepOperator,
			availableKeys: {
				orchestrator: build.imagesSet.orchestrator !== undefined,
				perStep: Object.keys(build.imagesSet.perStep),
				perStepOperator: Object.keys(build.imagesSet.perStepOperator),
			},
		});
	}
	const registryUrl = dockerImage ? deriveRegistryUrl(dockerImage.image) : null;
	return (
		<DockerImageSection
			dockerImage={dockerImage}
			pythonVersion={build.pythonVersion}
			registryUrl={registryUrl}
		/>
	);
}
