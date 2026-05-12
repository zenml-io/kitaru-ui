import type { RunConfiguration } from "../domain/execution";

export function buildReplayExecutionPayload(
	skipSuccessfulSteps: boolean,
	stepsToSkip?: string[]
): RunConfiguration {
	return {
		skip_successful_steps: skipSuccessfulSteps,
		...(stepsToSkip && stepsToSkip.length > 0
			? { steps_to_skip: stepsToSkip }
			: {}),
	};
}
