import type { Span } from "@/types/dashboard";
import { Clock } from "lucide-react";
import { DetailRow, DetailRows } from "./detail-row";
import { SpanDetailHeader } from "./span-detail-header";

export function SpanDetailSleep({ span }: { span: Span }) {
	const isSleeping = span.sleepStatus === "sleeping";

	return (
		<div className="p-6">
			<SpanDetailHeader type="sleep" name={span.name} />

			{isSleeping && (
				<div className="border-border bg-muted/30 mb-5 overflow-hidden rounded-lg border">
					<div className="bg-background border-border flex items-center gap-2 border-b px-4 py-3">
						<Clock className="text-muted-foreground h-4 w-4" />
						<span className="text-muted-foreground text-sm font-semibold">
							Sleep Timer
						</span>
					</div>
					<div className="flex flex-col items-center gap-1 p-5">
						<span className="text-foreground font-mono text-3xl font-bold">
							{span.sleepDuration}
						</span>
						<span className="text-muted-foreground text-xs">
							Wake at {span.sleepWake}
						</span>
					</div>
				</div>
			)}

			<DetailRows>
				<DetailRow label="Status" className="font-sans">
					<span className="flex items-center gap-1.5">
						<span
							className={`h-1.5 w-1.5 rounded-full ${isSleeping ? "bg-muted-foreground" : "bg-success"}`}
						/>
						{isSleeping ? "Sleeping" : "Completed"}
					</span>
				</DetailRow>
				<DetailRow label="Duration">{span.sleepDuration}</DetailRow>
				<DetailRow label="Wake Time">{span.sleepWake}</DetailRow>
			</DetailRows>
		</div>
	);
}
