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

type ExecutionDetailsProps = {
	execution: Execution;
	checkpoints: CheckpointEntry[];
	selectedCheckpointId?: string;
	onSelectCheckpoint: (id: string) => void;
	waitCondition?: WaitCondition;
	onResolveWaitCondition?: (params: ResolveWaitConditionParams) => void;
	resumeHint?: React.ReactNode;
};

export function ExecutionDetails({
	execution,
	checkpoints,
	onSelectCheckpoint,
	waitCondition,
	onResolveWaitCondition,
	resumeHint,
}: ExecutionDetailsProps) {
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

			{resumeHint && (
				<>
					<div className="bg-border h-px shrink-0" />
					{resumeHint}
				</>
			)}
			{waitCondition && (
				<>
					<div className="bg-border h-px shrink-0" />
					<WaitInputSection
						waitCondition={waitCondition}
						onResolve={onResolveWaitCondition}
					/>
				</>
			)}
		</main>
	);
}
