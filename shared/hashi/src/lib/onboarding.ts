export type OnboardingConfig<TStep extends string> = {
	steps: readonly TStep[];
	finalStep?: string;
	implicitCompletedSteps?: number;
};

export type OnboardingItemSetup = {
	isCompleted: boolean;
	isActive: boolean;
	hasDownstreamStep: boolean;
};

export type OnboardingSetup<TStep extends string> = {
	items: readonly TStep[];
	itemsDone: number;
	totalItems: number;
	progress: number;
	isFinished: boolean;
	hasItem: (item: TStep) => boolean;
	getItem: (item: TStep) => OnboardingItemSetup;
};

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.min(maximum, Math.max(minimum, value));
}

function normalizeCount(value: number): number {
	return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}

export function normalizeOnboardingProgress(
	itemsDone: number,
	totalItems: number
): Pick<OnboardingSetup<string>, "itemsDone" | "totalItems" | "progress"> {
	const normalizedTotal = normalizeCount(totalItems);
	const normalizedDone = Math.min(normalizedTotal, normalizeCount(itemsDone));

	return {
		itemsDone: normalizedDone,
		totalItems: normalizedTotal,
		progress:
			normalizedTotal === 0
				? 0
				: clamp((normalizedDone / normalizedTotal) * 100, 0, 100),
	};
}

export function getOnboardingSetup<TStep extends string>(
	state: readonly string[],
	config: OnboardingConfig<TStep>
): OnboardingSetup<TStep> {
	const normalizedState = new Set(state);
	const configuredSteps = new Set<string>(config.steps);
	const implicitCompletedSteps = Math.max(
		0,
		Math.trunc(config.implicitCompletedSteps ?? 0)
	);
	const hasFinalStep =
		config.finalStep !== undefined && normalizedState.has(config.finalStep);
	const highestCompletedIndex = hasFinalStep
		? config.steps.length - 1
		: config.steps.reduce(
				(highestIndex, step, index) =>
					normalizedState.has(step) ? index : highestIndex,
				-1
			);
	const completedTrackedItems = highestCompletedIndex + 1;
	const itemsDone = implicitCompletedSteps + completedTrackedItems;
	const totalItems = implicitCompletedSteps + config.steps.length;
	const { progress } = normalizeOnboardingProgress(itemsDone, totalItems);
	const isFinished = config.finalStep
		? hasFinalStep
		: config.steps.every((step) => normalizedState.has(step));

	return {
		items: config.steps,
		itemsDone,
		totalItems,
		progress,
		isFinished,
		hasItem: (item) => configuredSteps.has(item) && normalizedState.has(item),
		getItem: (item) => {
			const stepIndex = config.steps.indexOf(item);
			const isCompleted = stepIndex !== -1 && normalizedState.has(item);
			const downstreamSteps = config.steps.slice(stepIndex + 1);
			const hasDownstreamStep =
				stepIndex !== -1 &&
				(downstreamSteps.some((step) => normalizedState.has(step)) ||
					hasFinalStep);
			const previousStep =
				stepIndex > 0 ? config.steps[stepIndex - 1] : undefined;
			const isActive =
				stepIndex !== -1 &&
				!isCompleted &&
				!hasDownstreamStep &&
				(stepIndex === 0 ||
					(previousStep !== undefined && normalizedState.has(previousStep)));

			return { isCompleted, isActive, hasDownstreamStep };
		},
	};
}
