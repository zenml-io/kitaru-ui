import type { StepStatus } from "../../domain/step";

export type Span = {
	id: string;
	name: string;
	status: StepStatus;
	startMs: number;
	durationMs: number;
};
