import { differenceInMilliseconds } from "date-fns";
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderBody,
	PageHeaderContent,
} from "@/shared/ui/PageHeader";
import { Stat } from "@/modules/flows/ui/Stat";
import { formatDuration } from "@/shared/utils/time";
import type { Execution } from "../domain/execution";
import type { Checkpoint } from "@/modules/checkpoints/domain/checkpoint";
import type { Span } from "./traces/span-types";
import { SegmentedBar } from "./SegmentedBar";
import { TimelineAxis } from "./traces/TimelineAxis";
import { TimelineSpans } from "./traces/TimelineSpans";

interface ExecutionDetailsProps {
	execution: Execution;
	timedCheckpoints: (Checkpoint & { startTime: Date; endTime: Date })[];
	spans: Span[];
	totalMs: number;
	selectedSpanId?: string;
	onSelectSpan: (id: string) => void;
}

export function ExecutionDetails({
	execution,
	timedCheckpoints,
	spans,
	totalMs,
	selectedSpanId,
	onSelectSpan,
}: ExecutionDetailsProps) {
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
					{timedCheckpoints.length > 0 && (
						<PageHeaderActions>
							<div className="flex flex-1 flex-col gap-1">
								<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
									Duration Breakdown
								</span>
								<SegmentedBar
									height="h-6"
									gap
									segments={timedCheckpoints.map((c) => ({
										key: c.id,
										label: formatDuration(c.startTime, c.endTime),
										value: differenceInMilliseconds(c.endTime, c.startTime),
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
				selectedId={selectedSpanId}
				onSelect={onSelectSpan}
			/>
		</main>
	);
}
