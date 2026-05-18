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

	const visibleStepOperatorIds = resolveVisibleIds({
		components: stepOperators,
		config: checkpoint.stepOperator,
		onTrueStrategy: "first",
	});
	const visibleExperimentTrackerIds = resolveVisibleIds({
		components: experimentTrackers,
		config: checkpoint.experimentTracker,
		onTrueStrategy: "all",
	});

	return stack.components.filter((c) => {
		if (c.type === "step_operator") return visibleStepOperatorIds.has(c.id);
		if (c.type === "experiment_tracker")
			return visibleExperimentTrackerIds.has(c.id);
		return true;
	});
}

function resolveVisibleIds({
	components,
	config,
	onTrueStrategy,
}: {
	components: StackComponent[];
	config: boolean | string | undefined;
	onTrueStrategy: "first" | "all";
}): Set<string> {
	if (typeof config === "string") {
		const match = components.find((c) => c.name === config);
		return new Set(match ? [match.id] : []);
	}
	if (config === true) {
		const visible =
			onTrueStrategy === "all" ? components : components.slice(0, 1);
		return new Set(visible.map((c) => c.id));
	}
	return new Set();
}
