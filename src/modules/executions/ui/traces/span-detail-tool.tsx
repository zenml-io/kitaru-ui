import type { Span } from "@/types/dashboard";
import { formatDurationShort } from "@/lib/format";
import { JsonViewer } from "@/components/dashboard/json-viewer";
import { ArtifactBlock } from "@/components/traces/artifact-block";
import { DetailRow, DetailRows } from "./detail-row";
import { SpanDetailHeader } from "./span-detail-header";

export function SpanDetailTool({ span }: { span: Span }) {
	return (
		<div className="p-6">
			<SpanDetailHeader type="tool" name={span.name} />

			<DetailRows>
				<DetailRow label="Duration" className="tabular-nums">
					{formatDurationShort(span.durationMs)}
				</DetailRow>
			</DetailRows>

			{span.artifacts?.input && (
				<div className="mt-5">
					<ArtifactBlock
						label="Input"
						copyText={JSON.stringify(span.artifacts.input, null, 2)}
					>
						<JsonViewer data={span.artifacts.input} />
					</ArtifactBlock>
				</div>
			)}

			{span.artifacts?.output && (
				<div className="mt-5">
					<ArtifactBlock
						label="Output"
						copyText={JSON.stringify(span.artifacts.output, null, 2)}
					>
						<JsonViewer data={span.artifacts.output} />
					</ArtifactBlock>
				</div>
			)}
		</div>
	);
}
