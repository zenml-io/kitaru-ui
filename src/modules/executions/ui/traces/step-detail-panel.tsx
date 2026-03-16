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
import type { StepArtifacts } from "../../domain/step-artifacts";
import { ArtifactBlock } from "./artifact-block";
import { JsonViewer } from "./json-viewer";

interface StepDetailPanelProps {
	span: Span | null;
	artifacts: StepArtifacts | null;
	isLoadingArtifacts: boolean;
}

export function StepDetailPanel({
	span,
	artifacts,
	isLoadingArtifacts,
}: StepDetailPanelProps) {
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

			{isLoadingArtifacts && (
				<p className="text-muted-foreground mt-4 text-xs">Loading artifacts…</p>
			)}

			{artifacts && (
				<>
					<ArtifactSection label="Inputs" entries={artifacts.inputs} />
					<ArtifactSection label="Outputs" entries={artifacts.outputs} />
				</>
			)}
		</div>
	);
}

function ArtifactSection({
	label,
	entries,
}: {
	label: string;
	entries: Record<string, unknown>;
}) {
	const keys = Object.keys(entries);
	if (keys.length === 0) return null;

	return (
		<div className="mt-4">
			<p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
				{label}
			</p>
			<div className="flex flex-col gap-1">
				{keys.map((key) => (
					<ArtifactBlock
						key={key}
						label={key}
						copyText={JSON.stringify(entries[key], null, 2)}
					>
						<JsonViewer data={entries[key]} />
					</ArtifactBlock>
				))}
			</div>
		</div>
	);
}
