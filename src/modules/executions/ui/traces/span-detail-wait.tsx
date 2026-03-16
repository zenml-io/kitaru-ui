import type { Span } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { DetailRow, DetailRows } from "./detail-row";
import { SpanDetailHeader } from "./span-detail-header";

export function SpanDetailWait({ span }: { span: Span }) {
	const isWaiting = span.waitStatus === "waiting";

	return (
		<div className="p-6">
			<SpanDetailHeader type="wait" name={span.name} />

			{isWaiting && (
				<div className="border-warning bg-warning/5 mb-5 overflow-hidden rounded-lg border">
					<div className="bg-warning/15 border-warning/20 flex items-center gap-2 border-b px-4 py-3">
						<span className="bg-warning h-2.5 w-2.5 rounded-full" />
						<span className="text-warning text-sm font-semibold">
							Awaiting Approval
						</span>
					</div>
					<div className="flex flex-col gap-3 p-4">
						<span className="text-warning text-xs font-medium tracking-wider uppercase">
							Prompt
						</span>
						<p className="text-foreground text-base leading-snug font-medium">
							{span.waitPrompt}
						</p>
						<div className="flex gap-2">
							<Button className="bg-warning hover:bg-warning/90 flex-1 text-white">
								Approve
							</Button>
							<Button variant="outline" className="flex-1">
								Reject
							</Button>
						</div>
					</div>
				</div>
			)}

			<DetailRows>
				<DetailRow label="Status" className="font-sans">
					<span className="flex items-center gap-1.5">
						<span
							className={`h-1.5 w-1.5 rounded-full ${isWaiting ? "bg-warning" : "bg-success"}`}
						/>
						{isWaiting ? "Waiting" : "Resolved"}
					</span>
				</DetailRow>
				<DetailRow label="Prompt" className="font-sans">
					{span.waitPrompt}
				</DetailRow>
			</DetailRows>
		</div>
	);
}
