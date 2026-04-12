import type { ReactNode } from "react";
import type { MemoryEntry } from "../domain/memory";
import { MemoryDetailPanel } from "./MemoryDetailPanel";
import { MemoryEmptyState } from "./MemoryEmptyState";
import { MemoryErrorState } from "./MemoryErrorState";

type MemoryCenterPanelProps = {
	isPending: boolean;
	isError: boolean;
	error: unknown;
	isEmpty: boolean;
	isFlowScope: boolean;
	scopeName: string;
	detailEntry: MemoryEntry | undefined;
	preview: ReactNode;
	previewActions: ReactNode;
};

export function MemoryCenterPanel({
	isPending,
	isError,
	error,
	isEmpty,
	isFlowScope,
	scopeName,
	detailEntry,
	preview,
	previewActions,
}: MemoryCenterPanelProps) {
	if (isPending) {
		return (
			<div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
				Loading memory entries...
			</div>
		);
	}

	if (isError) {
		return <MemoryErrorState error={error} />;
	}

	if (isEmpty) {
		return (
			<MemoryEmptyState
				variant={isFlowScope ? "no-memory" : "no-scope-memory"}
				scopeName={scopeName}
			/>
		);
	}

	if (!detailEntry) return null;

	return (
		<MemoryDetailPanel
			entry={detailEntry}
			preview={preview}
			previewActions={previewActions}
		/>
	);
}
