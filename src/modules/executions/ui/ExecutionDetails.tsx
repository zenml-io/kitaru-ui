import { useScrollHighlight } from "@/shared/business-logic/use-scroll-highlight";
import type { WaitCondition } from "../domain/wait-condition";
import type { ResolveWaitConditionParams } from "../domain/resolve-wait-condition";
import type { TimelineEntry } from "../domain/waiting-block";
import { CheckpointThread } from "./traces/CheckpointThread";
import { ExecutionTimelineBar } from "./traces/ExecutionTimelineBar";
import { WaitInputSection } from "./WaitInputSection";
import {
	ToggleLeftPanelButton,
	ToggleRightPanelButton,
} from "@/shared/ui/ThreePanelLayoutContext";

type ExecutionDetailsProps = {
	timelineEntries: TimelineEntry[];
	selectedCheckpointId: string | undefined;
	onSelectCheckpoint: (id: string) => void;
	waitCondition?: WaitCondition;
	onResolveWaitCondition?: (params: ResolveWaitConditionParams) => void;
	resumeHint?: React.ReactNode;
};

export function ExecutionDetails({
	timelineEntries,
	selectedCheckpointId,
	onSelectCheckpoint,
	waitCondition,
	onResolveWaitCondition,
	resumeHint,
}: ExecutionDetailsProps) {
	const scrollHighlight = useScrollHighlight();

	const handleTimelineSelect = (entry: TimelineEntry) => {
		scrollHighlight.focus(entry.data.id);

		if (entry.kind === "checkpoint") {
			onSelectCheckpoint(entry.data.id);
		}
	};

	return (
		<main className="flex min-h-0 flex-1 flex-col">
			<div className="border-border flex shrink-0 items-center gap-2 border-b p-2">
				<ToggleLeftPanelButton
					ariaLabel={(open) =>
						open ? "Close executions list" : "Open executions list"
					}
				/>
				<div className="flex-1" />
				<ToggleRightPanelButton
					ariaLabel={(open) =>
						open ? "Close checkpoint details" : "Open checkpoint details"
					}
				/>
			</div>
			<ExecutionTimelineBar
				timelineEntries={timelineEntries}
				onSelect={handleTimelineSelect}
			/>
			<CheckpointThread
				timelineEntries={timelineEntries}
				selectedCheckpointId={selectedCheckpointId}
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
