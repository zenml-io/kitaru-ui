import type { components } from "@/shared/api/openapi";

export type ExecutionStatus = components["schemas"]["ExecutionStatus"];

export const executionStatusValues: ExecutionStatus[] = [
	"initializing",
	"provisioning",
	"running",
	"failed",
	"completed",
	"cached",
	"skipped",
	"retrying",
	"retried",
	"stopped",
	"stopping",
] as const;
