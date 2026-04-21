import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { cn } from "@/shared/utils/styles";
import { formatExecutionIndex } from "../util/execution";

type ExecutionLogsScopeSidebarProps = {
	executionIndex: number;
	checkpoints: CheckpointEntry[];
	isRootActive: boolean;
	activeCheckpointId: string | null;
	onSelectRoot: () => void;
	onSelectCheckpoint: (checkpointId: string) => void;
};

export function ExecutionLogsScopeSidebar({
	executionIndex,
	checkpoints,
	isRootActive,
	activeCheckpointId,
	onSelectRoot,
	onSelectCheckpoint,
}: ExecutionLogsScopeSidebarProps) {
	return (
		<nav
			aria-label="Log scope"
			className="border-border bg-card flex w-56 shrink-0 flex-col border-r"
		>
			<ScopeRow
				label={`Execution #${formatExecutionIndex(executionIndex)}`}
				isActive={isRootActive}
				onClick={onSelectRoot}
				emphasized
			/>
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
				{checkpoints.map((cp) => (
					<ScopeRow
						key={cp.id}
						label={cp.name}
						isActive={cp.id === activeCheckpointId}
						onClick={() => onSelectCheckpoint(cp.id)}
					/>
				))}
			</div>
		</nav>
	);
}

type ScopeRowProps = {
	label: string;
	isActive: boolean;
	onClick: () => void;
	emphasized?: boolean;
};

function ScopeRow({ label, isActive, onClick, emphasized }: ScopeRowProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-current={isActive ? "true" : undefined}
			className={cn(
				"shrink-0 truncate px-3 text-left text-xs transition-colors",
				emphasized
					? "border-border text-foreground flex h-9 items-center border-b font-semibold"
					: "text-muted-foreground hover:text-foreground py-2",
				isActive ? "bg-accent" : "hover:bg-accent/50",
				isActive && !emphasized && "text-foreground font-medium"
			)}
		>
			{label}
		</button>
	);
}
