import type { components } from "@/shared/api/openapi";

type Status = components["schemas"]["ExecutionStatus"];

export function getIsActiveStatus(status: Status | undefined): boolean {
	return (
		status === "running" ||
		status === "initializing" ||
		status === "provisioning" ||
		status === "resuming"
	);
}
