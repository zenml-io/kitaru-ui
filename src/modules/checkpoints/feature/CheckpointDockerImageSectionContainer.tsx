import { useSuspenseQuery } from "@tanstack/react-query";
import { buildsQueries } from "@/modules/builds/business-logic/builds-queries";
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
		build.images,
		checkpointName,
		checkpointStepOperator
	);
	if (!dockerImage) return null;
	return (
		<DockerImageSection
			dockerImage={dockerImage}
			pythonVersion={build.pythonVersion}
		/>
	);
}
