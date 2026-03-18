import { differenceInMilliseconds } from "date-fns";
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderBody,
	PageHeaderContent,
} from "@/shared/ui/PageHeader";
import { Stat } from "@/modules/flows/ui/Stat";
import { formatDuration, formatDurationShort } from "@/shared/utils/time";
import type { Execution } from "../domain/execution";
import type { Checkpoint } from "@/modules/checkpoints/domain/checkpoint";
import { SegmentedBar } from "./SegmentedBar";
import { TimelineAxis } from "./traces/TimelineAxis";
import { TimelineSpans } from "./traces/TimelineSpans";

interface ExecutionDetailsProps {
	execution: Execution;
	checkpoints: Checkpoint[];
	selectedCheckpointId?: string;
	onSelectCheckpoint: (id: string) => void;
}

export function ExecutionDetails({
	execution,
	checkpoints,
	selectedCheckpointId,
	onSelectCheckpoint,
}: ExecutionDetailsProps) {
	const totalMs =
		execution.startTime && execution.endTime
			? differenceInMilliseconds(execution.endTime, execution.startTime)
			: checkpoints.reduce((sum, c) => sum + c.durationMs, 0);

	const spans = checkpoints.map((c) => ({
		...c,
		startMs:
			c.startTime && execution.startTime
				? differenceInMilliseconds(c.startTime, execution.startTime)
				: 0,
	}));

	return (
		<main className="flex-1 overflow-y-auto">
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
					{checkpoints.length > 0 && (
						<PageHeaderActions>
							<div className="flex flex-1 flex-col gap-1">
								<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
									Duration Breakdown
								</span>
								<SegmentedBar
									height="h-6"
									gap
									segments={checkpoints.map((c) => ({
										key: c.id,
										label: formatDurationShort(c.durationMs),
										value: c.durationMs,
										className: "bg-primary",
										minWidth: "min-w-10",
									}))}
								/>
							</div>
						</PageHeaderActions>
					)}
				</PageHeaderContent>
			</PageHeader>

			{spans.length > 0 && (
				<div className="flex items-center border-b py-1.5 pl-[240px]">
					<TimelineAxis totalMs={totalMs} />
				</div>
			)}

			<TimelineSpans
				spans={spans}
				totalMs={totalMs}
				selectedId={selectedCheckpointId}
				onSelect={onSelectCheckpoint}
			/>
		</main>
	);
}
