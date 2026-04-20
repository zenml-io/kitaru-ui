import { cn } from "@/shared/utils/styles";
import { formatExecutionIndex } from "../util/execution";

export type ExecutionLogsScope =
	| { kind: "root" }
	| { kind: "checkpoint"; checkpointId: string };

type CheckpointOption = {
	id: string;
	name: string;
};

type ExecutionLogsScopeSidebarProps = {
	executionIndex: number;
	checkpoints: CheckpointOption[];
	selectedScope: ExecutionLogsScope;
	onSelectScope: (scope: ExecutionLogsScope) => void;
};

export function ExecutionLogsScopeSidebar({
	executionIndex,
	checkpoints,
	selectedScope,
	onSelectScope,
}: ExecutionLogsScopeSidebarProps) {
	const isRootActive = selectedScope.kind === "root";
	const activeCheckpointId =
		selectedScope.kind === "checkpoint" ? selectedScope.checkpointId : null;

	return (
		<nav
			aria-label="Log scope"
			className="border-border bg-card flex w-56 shrink-0 flex-col border-r"
		>
			<ScopeRow
				label={`Execution #${formatExecutionIndex(executionIndex)}`}
				isActive={isRootActive}
				onClick={() => onSelectScope({ kind: "root" })}
			/>
			<div className="border-border border-t" />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
				{checkpoints.map((cp) => (
					<ScopeRow
						key={cp.id}
						label={cp.name}
						isActive={cp.id === activeCheckpointId}
						onClick={() =>
							onSelectScope({ kind: "checkpoint", checkpointId: cp.id })
						}
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
};

function ScopeRow({ label, isActive, onClick }: ScopeRowProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-current={isActive ? "true" : undefined}
			className={cn(
				"shrink-0 truncate px-3 py-2 text-left text-xs transition-colors",
				isActive
					? "bg-accent text-foreground font-medium"
					: "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
			)}
		>
			{label}
		</button>
	);
}
