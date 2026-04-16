import {
	PageHeader,
	PageHeaderBody,
	PageHeaderContent,
} from "@/shared/ui/PageHeader";
import { Stat } from "@/modules/flows/ui/Stat";
import { getCanShowDuration } from "@/shared/business-logic/duration";
import { useScrollHighlight } from "@/shared/business-logic/use-scroll-highlight";
import { LiveDurationMs } from "@/shared/ui/LiveDurationMs";
import type { Execution } from "../domain/execution";
import type { WaitCondition } from "../domain/wait-condition";
import type { ResolveWaitConditionParams } from "../domain/resolve-wait-condition";
import type { TimelineEntry } from "../domain/waiting-block";
import { CheckpointThread } from "./traces/CheckpointThread";
import { ExecutionTimelineBar } from "./traces/ExecutionTimelineBar";
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

	const scrollHighlight = useScrollHighlight();

	const handleTimelineSelect = (entry: TimelineEntry) => {
		scrollHighlight.focus(entry.data.id);

		if (entry.kind === "checkpoint") {
			onSelectCheckpoint(entry.data.id);
		}
	};

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
			<ExecutionTimelineBar
				timelineEntries={timelineEntries}
				onSelect={handleTimelineSelect}
			/>
			<CheckpointThread
				timelineEntries={timelineEntries}
				onSelect={onSelectCheckpoint}
				highlightedId={scrollHighlight.highlightedId}
			/>

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
