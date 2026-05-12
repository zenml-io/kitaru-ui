import type { Execution } from "./execution";

export function filterLocalExecutions(
	executions: Execution[],
	kitaruSnapshotIds: Set<string>
): Execution[] {
	return executions.filter(
		(e) => !e.sourceSnapshot?.id || !kitaruSnapshotIds.has(e.sourceSnapshot.id)
	);
}
