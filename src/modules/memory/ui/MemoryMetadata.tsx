import type { MemoryEntry } from "../domain/memory";
import { Badge } from "@/shared/ui/badge";
import { DetailItem } from "@/shared/ui/detail-list/DetailItem";
import { DetailList } from "@/shared/ui/detail-list/DetailList";

type MemoryMetadataProps = {
	entry: MemoryEntry;
};

export function MemoryMetadata({ entry }: MemoryMetadataProps) {
	return (
		<DetailList>
			<DetailItem label="Scope">
				<span>{entry.scopeLabel ?? entry.scope}</span>
				<Badge variant="secondary" className="text-2xs ml-1.5">
					{entry.scopeType}
				</Badge>
			</DetailItem>
			<DetailItem label="Type">
				<code className="font-mono">{entry.valueType}</code>
			</DetailItem>
			<DetailItem label="Version">
				<span className="font-mono tabular-nums">v{entry.version}</span>
				{entry.isDeleted && (
					<Badge variant="destructive" className="text-2xs ml-1.5">
						deleted
					</Badge>
				)}
			</DetailItem>
			<DetailItem label="Created">
				{entry.createdAt.toLocaleString()}
			</DetailItem>
			<DetailItem label="Artifact ID">
				<code className="text-muted-foreground truncate font-mono">
					{entry.artifactId}
				</code>
			</DetailItem>
		</DetailList>
	);
}
