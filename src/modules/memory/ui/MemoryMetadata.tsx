import type { MemoryEntry } from "../domain/memory";
import { Badge } from "@/shared/ui/badge";

type MemoryMetadataProps = {
	entry: MemoryEntry;
};

function getScopeDisplayLabel(entry: MemoryEntry): string {
	return entry.scopeLabel ?? entry.scope;
}

export function MemoryMetadata({ entry }: MemoryMetadataProps) {
	return (
		<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
			<MetadataRow label="Scope">
				<span>{getScopeDisplayLabel(entry)}</span>
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
			<MetadataRow label="Artifact ID">
				<code className="text-muted-foreground truncate font-mono">
					{entry.artifactId}
				</code>
			</MetadataRow>
		</dl>
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
