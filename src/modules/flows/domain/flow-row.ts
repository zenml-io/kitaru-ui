import type { FlowStatus } from "./flow-status";

// TODO: Add properties from the API
export type FlowRow = {
	id: string;
	name: string;
	description: string;
	status: FlowStatus;
	lastExecutedAt: string;
	executions: number;
	averageCostUsd: number;
};
