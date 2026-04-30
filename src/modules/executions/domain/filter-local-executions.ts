import type { Execution } from "./execution";

export function filterLocalExecutions(
	executions: Execution[],
	kitaruSnapshotIds: Set<string>
): Execution[] {
	return executions.filter(
		(e) => !e.sourceSnapshotId || !kitaruSnapshotIds.has(e.sourceSnapshotId)
	);
}
