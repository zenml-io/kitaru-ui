import type { Stack, StackComponent } from "@/modules/stacks/domain/stack";

type CheckpointConfig = {
	stepOperator?: boolean | string;
	experimentTracker?: boolean | string;
};

export function selectVisibleStackComponents(
	stack: Stack,
	checkpoint: CheckpointConfig
): StackComponent[] {
	const stepOperators = stack.components.filter(
		(c) => c.type === "step_operator"
	);
	const experimentTrackers = stack.components.filter(
		(c) => c.type === "experiment_tracker"
	);
	const visibleStepOperator = pickSingle(
		stepOperators,
		checkpoint.stepOperator
	);
	const showAllExperimentTrackers = checkpoint.experimentTracker === true;
	const visibleExperimentTracker = pickSingle(
		experimentTrackers,
		checkpoint.experimentTracker
	);

	return stack.components.filter((c) => {
		if (c.type === "step_operator") return c.id === visibleStepOperator?.id;
		if (c.type === "experiment_tracker") {
			return showAllExperimentTrackers || c.id === visibleExperimentTracker?.id;
		}
		return true;
	});
}

function pickSingle(
	components: StackComponent[],
	config: boolean | string | undefined
): StackComponent | undefined {
	if (typeof config === "string") {
		return components.find((c) => c.name === config);
	}
	if (config === true) return components[0];
	return undefined;
}
