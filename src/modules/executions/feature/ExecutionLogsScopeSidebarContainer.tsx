import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { ExecutionLogsScopeSidebar } from "../ui/ExecutionLogsScopeSidebar";

export type ExecutionLogsScope =
	| { kind: "root" }
	| { kind: "checkpoint"; checkpointId: string };

type ExecutionLogsScopeSidebarContainerProps = {
	executionIndex: number;
	checkpoints: CheckpointEntry[];
	selectedScope: ExecutionLogsScope;
	onSelectScope: (scope: ExecutionLogsScope) => void;
};

export function ExecutionLogsScopeSidebarContainer({
	executionIndex,
	checkpoints,
	selectedScope,
	onSelectScope,
}: ExecutionLogsScopeSidebarContainerProps) {
	const isRootActive = selectedScope.kind === "root";
	const activeCheckpointId =
		selectedScope.kind === "checkpoint" ? selectedScope.checkpointId : null;

	return (
		<ExecutionLogsScopeSidebar
			executionIndex={executionIndex}
			checkpoints={checkpoints}
			isRootActive={isRootActive}
			activeCheckpointId={activeCheckpointId}
			onSelectRoot={() => onSelectScope({ kind: "root" })}
			onSelectCheckpoint={(checkpointId) =>
				onSelectScope({ kind: "checkpoint", checkpointId })
			}
		/>
	);
}
