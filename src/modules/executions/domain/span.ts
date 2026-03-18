import type { components } from "@/shared/api/openapi";

export type Span = {
	id: string;
	name: string;
	type: components["schemas"]["StepType"];
	status: string;
	startMs: number;
	durationMs: number;
};
