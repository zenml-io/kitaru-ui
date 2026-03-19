import {
	PageHeader,
	PageHeaderBody,
	PageHeaderContent,
} from "@/shared/ui/PageHeader";
import { Stat } from "@/modules/flows/ui/Stat";
import { formatDuration } from "@/shared/utils/time";
import type { Execution } from "../domain/execution";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { CheckpointThread } from "./traces/CheckpointThread";

type ExecutionDetailsProps = {
	execution: Execution;
	checkpoints: CheckpointEntry[];
	selectedCheckpointId?: string;
	onSelectCheckpoint: (id: string) => void;
};

export function ExecutionDetails({
	execution,
	checkpoints,
	onSelectCheckpoint,
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
				</PageHeaderContent>
			</PageHeader>
			<CheckpointThread
				checkpoints={checkpoints}
				onSelect={onSelectCheckpoint}
			/>
		</main>
	);
}
