type ReplayableStep = {
	id: string;
};

export function buildCheckpointsToSkip(
	steps: ReplayableStep[],
	selectedStepId?: string
): string[] {
	if (!selectedStepId) {
		return [];
	}

	const selectedStepIndex = steps.findIndex(
		(step) => step.id === selectedStepId
	);

	if (selectedStepIndex <= 0) {
		return [];
	}

	return steps.slice(0, selectedStepIndex).map((step) => step.id);
}
