import type { Span } from "@/types/dashboard";
import { formatDurationShort, formatCost, formatTokens } from "@/lib/format";
import { SegmentedBar } from "@/components/ui/segmented-bar";
import { SectionDivider } from "@/components/ui/section-divider";
import { ArtifactBlock } from "./artifact-block";
import { DetailRow, DetailRows } from "./detail-row";
import { SpanDetailHeader } from "./span-detail-header";

export function SpanDetailLlm({ span }: { span: Span }) {
	return (
		<div className="p-6">
			<SpanDetailHeader type="llm" name={span.name} />

			{/* Key-value pairs */}
			<DetailRows>
				<DetailRow label="Model">{span.model}</DetailRow>
				<DetailRow label="Profile">{span.profile || "default"}</DetailRow>
				<DetailRow label="Duration" className="tabular-nums">
					{formatDurationShort(span.durationMs)}
				</DetailRow>
				<DetailRow label="Cost" className="tabular-nums">
					{span.cost ? formatCost(span.cost) : "—"}
				</DetailRow>
			</DetailRows>

			{/* Token bar */}
			{span.tokens && <SectionDivider>Tokens</SectionDivider>}
			{span.tokens && (
				<SegmentedBar
					segments={[
						{
							key: "input",
							label: <>{formatTokens(span.tokens.input)} in</>,
							value: span.tokens.input,
							className: "bg-primary",
						},
						{
							key: "output",
							label: <>{formatTokens(span.tokens.output)} out</>,
							value: span.tokens.output,
							className: "bg-muted-foreground",
							textClassName: "text-primary-foreground",
						},
					]}
				/>
			)}

			{/* Artifacts */}
			{span.artifacts && (
				<div className="mt-5">
					{span.artifacts.prompt && (
						<ArtifactBlock label="Prompt" content={span.artifacts.prompt} />
					)}
					{span.artifacts.response && (
						<ArtifactBlock label="Response" content={span.artifacts.response} />
					)}
				</div>
			)}
		</div>
	);
}
