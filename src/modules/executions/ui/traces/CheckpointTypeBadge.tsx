import { Badge } from "@/shared/ui/badge";
import {
	getCheckpointSurfaceClass,
	getCheckpointTextClass,
} from "./checkpoint-styles";
import { cn } from "@/shared/utils/styles";

const checkpointTypeLabels: Record<string, string> = {
	flow: "flow",
	llm: "llm",
	llm_call: "llm",
	checkpoint: "checkpoint",
	tool: "tool",
	tool_call: "tool",
	wait: "wait",
	sleep: "sleep",
	parallel: "parallel",
};

interface CheckpointTypeBadgeProps {
	type: string;
}

export function CheckpointTypeBadge({ type }: CheckpointTypeBadgeProps) {
	return (
		<Badge
			variant="secondary"
			className={cn(
				"text-2xs rounded-sm border-current/20 px-1.5 py-0 font-mono font-medium",
				getCheckpointSurfaceClass(type),
				getCheckpointTextClass(type)
			)}
		>
			{checkpointTypeLabels[type] ?? type}
		</Badge>
	);
}
