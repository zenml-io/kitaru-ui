import {
	PageHeader,
	PageHeaderBody,
	PageHeaderContent,
} from "@/shared/ui/PageHeader";
import { Stat } from "@/modules/flows/ui/Stat";
import { getIsActiveStatus } from "@/shared/business-logic/status";
import { useNow } from "@/shared/business-logic/use-now";
import { formatDuration } from "@/shared/utils/time";
import type { Execution } from "../domain/execution";
import type { WaitCondition } from "../domain/wait-condition";
import type { ResolveWaitConditionParams } from "../domain/resolve-wait-condition";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { CheckpointThread } from "./traces/CheckpointThread";
import { WaitInputSection } from "./WaitInputSection";

type ExecutionDetailsProps = {
	execution: Execution;
	checkpointsEntries: CheckpointEntry[];
	onSelectCheckpoint: (id: string) => void;
	waitCondition?: WaitCondition;
	onResolveWaitCondition?: (params: ResolveWaitConditionParams) => void;
	resumeHint?: React.ReactNode;
};

export function ExecutionDetails({
	execution,
	checkpointsEntries,
	onSelectCheckpoint,
	waitCondition,
	onResolveWaitCondition,
	resumeHint,
}: ExecutionDetailsProps) {
	const isActive = getIsActiveStatus(execution.status);
	const now = useNow(isActive);

	return (
		<main className="flex min-h-0 flex-1 flex-col">
			<PageHeader>
				<PageHeaderContent>
					<PageHeaderBody>
						<Stat
							label="Duration"
							value={
								formatDuration(
									execution.startTime,
									isActive ? now : execution.endTime
								) ?? "—"
							}
							valueColor="default"
							valueSize="sm"
						/>
					</PageHeaderBody>
				</PageHeaderContent>
			</PageHeader>
			<div className="flex-1 overflow-y-auto">
				<CheckpointThread
					checkpointsEntries={checkpointsEntries}
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
