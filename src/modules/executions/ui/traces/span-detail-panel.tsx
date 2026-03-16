import type { Span } from "@/types/dashboard";
import { Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
} from "@/components/ui/empty";
import { SpanDetailLlm } from "./span-detail-llm";
import { SpanDetailTool } from "./span-detail-tool";
import { SpanDetailWait } from "./span-detail-wait";
import { SpanDetailSleep } from "./span-detail-sleep";
import { SpanDetailFlow } from "./span-detail-flow";

function findSpan(root: Span, id: string): Span | null {
	if (root.id === id) return root;
	for (const child of root.children) {
		const found = findSpan(child, id);
		if (found) return found;
	}
	return null;
}

interface SpanDetailPanelProps {
	root: Span;
	selectedId: string | null;
}

export function SpanDetailPanel({ root, selectedId }: SpanDetailPanelProps) {
	const span = selectedId ? findSpan(root, selectedId) : null;

	if (!span) {
		return (
			<Empty className="h-full border-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Info className="size-5" />
					</EmptyMedia>
					<EmptyDescription>Select a span to view details</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	const detailMap: Record<string, React.FC<{ span: Span }>> = {
		llm: SpanDetailLlm,
		tool: SpanDetailTool,
		wait: SpanDetailWait,
		sleep: SpanDetailSleep,
		flow: SpanDetailFlow,
	};

	const DetailComponent = detailMap[span.type];

	return (
		<ScrollArea className="h-full">
			{DetailComponent ? (
				<DetailComponent span={span} />
			) : (
				<Empty className="h-full border-none">
					<EmptyHeader>
						<EmptyDescription>
							No detail view for span type: {span.type}
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</ScrollArea>
	);
}
