import { useState } from "react";
import {
	PageHeader,
	PageHeaderBody,
	PageHeaderContent,
} from "@/shared/ui/PageHeader";
import { Stat } from "@/modules/flows/ui/Stat";
import { formatDuration } from "@/shared/utils/time";
import type { Execution } from "../domain/execution";
import type { WaitCondition } from "../domain/wait-condition";
import type { ResolveWaitConditionParams } from "../domain/resolve-wait-condition";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { CheckpointThread } from "./traces/CheckpointThread";
import { WaitInputSection } from "./WaitInputSection";
import { ColorDot } from "@/shared/ui/ColorDot";
import { ChevronUp } from "@untitledui/icons";

type ExecutionDetailsProps = {
	execution: Execution;
	checkpoints: CheckpointEntry[];
	selectedCheckpointId?: string;
	onSelectCheckpoint: (id: string) => void;
	waitCondition?: WaitCondition;
	onResolveWaitCondition?: (params: ResolveWaitConditionParams) => void;
};

export function ExecutionDetails({
	execution,
	checkpoints,
	onSelectCheckpoint,
	waitCondition,
	onResolveWaitCondition,
}: ExecutionDetailsProps) {
	const [waitPanelOpen, setWaitPanelOpen] = useState(true);

	return (
		<main className="flex min-h-0 flex-1 flex-col">
			<PageHeader>
				<PageHeaderContent>
					<PageHeaderBody>
						<Stat
							label="Duration"
							value={
								formatDuration(execution.startTime, execution.endTime) ?? "—"
							}
							valueColor="default"
							valueSize="sm"
						/>
					</PageHeaderBody>
				</PageHeaderContent>
			</PageHeader>
			<div className="flex-1 overflow-y-auto">
				<CheckpointThread
					checkpoints={checkpoints}
					onSelect={onSelectCheckpoint}
				/>
			</div>

			{waitCondition && (
				<>
					<div className="bg-border h-px shrink-0" />
					{waitPanelOpen ? (
						<div className="bg-card shrink-0">
							<WaitInputSection
								waitCondition={waitCondition}
								onToggle={() => setWaitPanelOpen(false)}
								onResolve={onResolveWaitCondition}
							/>
						</div>
					) : (
						<button
							type="button"
							className="bg-card hover:bg-accent/30 flex h-10 shrink-0 cursor-pointer items-center gap-2 px-4 text-left transition-colors"
							aria-label="Expand wait input panel"
							onClick={() => setWaitPanelOpen(true)}
						>
							<ColorDot shape="round" size="sm" className="bg-warning" />
							<span className="text-foreground truncate font-mono text-xs font-semibold">
								{waitCondition.name}
							</span>
							{waitCondition.question && (
								<span className="text-muted-foreground flex-1 truncate text-xs">
									{waitCondition.question}
								</span>
							)}
							<ChevronUp className="text-muted-foreground size-3.5 shrink-0" />
						</button>
					)}
				</>
			)}
		</main>
	);
}
