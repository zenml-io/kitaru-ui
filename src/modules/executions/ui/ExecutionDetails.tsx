import {
	PageHeader,
	PageHeaderBody,
	PageHeaderContent,
} from "@/shared/ui/PageHeader";
import { Stat } from "@/modules/flows/ui/Stat";
import { getCanShowDuration } from "@/shared/business-logic/duration";
import { LiveDurationMs } from "@/shared/ui/LiveDurationMs";
import type { Execution } from "../domain/execution";
import type { WaitCondition } from "../domain/wait-condition";
import type { ResolveWaitConditionParams } from "../domain/resolve-wait-condition";
import type { TimelineEntry } from "../domain/waiting-block";
import { CheckpointThread } from "./traces/CheckpointThread";
import { WaitInputSection } from "./WaitInputSection";

type ExecutionDetailsProps = {
	execution: Execution;
	timelineEntries: TimelineEntry[];
	onSelectCheckpoint: (id: string) => void;
	waitCondition?: WaitCondition;
	onResolveWaitCondition?: (params: ResolveWaitConditionParams) => void;
	resumeHint?: React.ReactNode;
};

export function ExecutionDetails({
	execution,
	timelineEntries,
	onSelectCheckpoint,
	waitCondition,
	onResolveWaitCondition,
	resumeHint,
}: ExecutionDetailsProps) {
	const canShowDuration = getCanShowDuration({
		status: execution.status,
		startTime: execution.startTime,
		endTime: execution.endTime,
	});

	return (
		<main className="flex min-h-0 flex-1 flex-col">
			<PageHeader>
				<PageHeaderContent>
					<PageHeaderBody>
						{canShowDuration && (
							<Stat
								label="Duration"
								value={
									<LiveDurationMs
										status={execution.status}
										startTime={execution.startTime}
										endTime={execution.endTime}
									/>
								}
								valueColor="default"
								valueSize="sm"
							/>
						)}
					</PageHeaderBody>
				</PageHeaderContent>
			</PageHeader>
			<div className="flex-1 overflow-y-auto">
				<CheckpointThread
					timelineEntries={timelineEntries}
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
