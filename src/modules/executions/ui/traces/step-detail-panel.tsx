import { InfoCircle } from "@untitledui/icons";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
} from "@/shared/ui/empty";
import { formatDurationShort } from "@/shared/utils/time";
import { StatusDot } from "@/shared/ui/StatusDot";
import type { Span } from "./span-types";

interface StepDetailPanelProps {
	span: Span | null;
}

export function StepDetailPanel({ span }: StepDetailPanelProps) {
	if (!span) {
		return (
			<Empty className="h-full border-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<InfoCircle className="size-5" />
					</EmptyMedia>
					<EmptyDescription>Select a step to view details</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="p-4">
			<p className="font-mono text-sm font-semibold break-all">{span.name}</p>
			<div className="mt-4 flex flex-col divide-y">
				<div className="flex items-center justify-between py-2">
					<span className="text-muted-foreground text-xs">Status</span>
					<div className="flex items-center gap-1.5">
						<StatusDot status={span.status} />
						<span className="text-xs capitalize">{span.status}</span>
					</div>
				</div>
				<div className="flex items-center justify-between py-2">
					<span className="text-muted-foreground text-xs">Duration</span>
					<span className="font-mono text-xs">
						{span.durationMs > 0 ? formatDurationShort(span.durationMs) : "—"}
					</span>
				</div>
				<div className="flex items-center justify-between py-2">
					<span className="text-muted-foreground text-xs">Start offset</span>
					<span className="font-mono text-xs">
						{span.startMs > 0 ? formatDurationShort(span.startMs) : "0ms"}
					</span>
				</div>
			</div>
		</div>
	);
}
