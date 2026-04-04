import { Link } from "@tanstack/react-router";
import type { MemoryEntry } from "../domain/memory";
import { Badge } from "@/shared/ui/badge";

type MemoryDetailPanelProps = {
	entry: MemoryEntry;
	flowId: string;
	preview: React.ReactNode;
	previewActions?: React.ReactNode;
};

export function MemoryDetailPanel({
	entry,
	flowId,
	preview,
	previewActions,
}: MemoryDetailPanelProps) {
	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header + metadata */}
			<div className="border-border shrink-0 border-b px-4 py-3">
				<h2 className="mb-2 truncate text-sm font-semibold">{entry.key}</h2>
				<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
					<MetadataRow label="Scope">
						<span>{entry.scope}</span>
						<Badge variant="secondary" className="text-2xs ml-1.5">
							{entry.scopeType}
						</Badge>
					</MetadataRow>
					<MetadataRow label="Type">
						<code className="font-mono">{entry.valueType}</code>
					</MetadataRow>
					<MetadataRow label="Version">
						<span className="font-mono tabular-nums">v{entry.version}</span>
						{entry.isDeleted && (
							<Badge variant="destructive" className="text-2xs ml-1.5">
								deleted
							</Badge>
						)}
					</MetadataRow>
					<MetadataRow label="Created">
						{entry.createdAt.toLocaleString()}
					</MetadataRow>
					<MetadataRow label="Execution">
						{entry.executionId ? (
							<Link
								to="/flows/$flowId/executions/$executionId"
								params={{
									flowId,
									executionId: entry.executionId,
								}}
								className="text-primary hover:underline"
							>
								{entry.executionId}
							</Link>
						) : (
							<Badge variant="outline" className="text-2xs">
								external
							</Badge>
						)}
					</MetadataRow>
					<MetadataRow label="Artifact ID">
						<code className="text-muted-foreground truncate font-mono">
							{entry.artifactId}
						</code>
					</MetadataRow>
				</dl>
			</div>

			{/* Preview header */}
			<div className="bg-muted/50 flex shrink-0 items-center justify-between px-4 py-2">
				<span className="text-xs font-medium">Preview</span>
				{previewActions && (
					<div className="flex items-center gap-1">{previewActions}</div>
				)}
			</div>

			{/* Preview body */}
			<div className="bg-background min-h-0 flex-1 overflow-y-auto">
				{preview}
			</div>
		</div>
	);
}

function MetadataRow({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<dt className="text-muted-foreground whitespace-nowrap">{label}</dt>
			<dd className="flex min-w-0 items-center truncate">{children}</dd>
		</>
	);
}
