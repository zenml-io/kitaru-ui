import { useSuspenseQuery } from "@tanstack/react-query";
import { buildsQueries } from "@/modules/builds/business-logic/builds-queries";
import { deriveRegistryUrl } from "@/modules/builds/business-logic/derive-registry-url";
import { stacksQueries } from "@/modules/stacks/business-logic/stacks-queries";
import { selectDockerImage } from "../domain/select-docker-image";
import { DockerImageSection } from "../ui/configuration/DockerImageSection";

type Props = {
	buildId: string;
	checkpointName: string;
	checkpointStepOperator?: boolean | string;
	stackId?: string;
};

export function CheckpointDockerImageSectionContainer({
	buildId,
	checkpointName,
	checkpointStepOperator,
	stackId,
}: Props) {
	if (checkpointStepOperator === true && stackId) {
		return (
			<CheckpointDockerImageSectionWithStack
				buildId={buildId}
				checkpointName={checkpointName}
				stackId={stackId}
			/>
		);
	}
	return (
		<CheckpointDockerImageSectionView
			buildId={buildId}
			checkpointName={checkpointName}
			stepOperator={
				typeof checkpointStepOperator === "string"
					? checkpointStepOperator
					: undefined
			}
		/>
	);
}

function CheckpointDockerImageSectionWithStack({
	buildId,
	checkpointName,
	stackId,
}: {
	buildId: string;
	checkpointName: string;
	stackId: string;
}) {
	const { data: stack } = useSuspenseQuery(stacksQueries.detail(stackId));
	const stackDefaultStepOperator = stack.components.find(
		(c) => c.type === "step_operator"
	)?.name;
	return (
		<CheckpointDockerImageSectionView
			buildId={buildId}
			checkpointName={checkpointName}
			stepOperator={stackDefaultStepOperator}
		/>
	);
}

function CheckpointDockerImageSectionView({
	buildId,
	checkpointName,
	stepOperator,
}: {
	buildId: string;
	checkpointName: string;
	stepOperator?: string;
}) {
	const { data: build } = useSuspenseQuery(buildsQueries.detail(buildId));
	const dockerImage = selectDockerImage(
		build.imagesSet,
		checkpointName,
		stepOperator
	);
	const registryUrl = dockerImage ? deriveRegistryUrl(dockerImage.image) : null;
	return (
		<DockerImageSection
			dockerImage={dockerImage}
			pythonVersion={build.pythonVersion}
			registryUrl={registryUrl}
		/>
	);
}
