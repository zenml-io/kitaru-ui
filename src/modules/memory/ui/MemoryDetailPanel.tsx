import { TruncatedText } from "@/shared/ui/truncated-text";
import type { MemoryEntry } from "../domain/memory";
import { MemoryMetadata } from "./MemoryMetadata";

type MemoryDetailPanelProps = {
	entry: MemoryEntry;
	preview: React.ReactNode;
	previewActions?: React.ReactNode;
};

export function MemoryDetailPanel({
	entry,
	preview,
	previewActions,
}: MemoryDetailPanelProps) {
	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header + metadata */}
			<div className="border-border shrink-0 border-b px-4 py-3">
				<h2 className="mb-2">
					<TruncatedText className="text-sm font-semibold">
						{entry.key}
					</TruncatedText>
				</h2>
				<MemoryMetadata entry={entry} />
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
