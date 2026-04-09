import { useMemo } from "react";
import { Database01 } from "@untitledui/icons";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
} from "@/shared/ui/empty";
import { ChipBar } from "@/shared/ui/ChipBar";
import type { MemoryEntry, MemoryScopeType } from "../domain/memory";
import { MemoryChip } from "./MemoryChip";

const SCOPE_ORDER: MemoryScopeType[] = ["namespace", "flow", "execution"];

const SCOPE_LABELS: Record<string, string> = {
	namespace: "Namespace",
	flow: "Flow",
	execution: "Execution",
};

type CheckpointMemoryTabProps = {
	entries: MemoryEntry[];
	selectedKey?: string;
	onSelectKey: (key: string) => void;
	children?: React.ReactNode;
};

export function CheckpointMemoryTab({
	entries,
	selectedKey,
	onSelectKey,
	children,
}: CheckpointMemoryTabProps) {
	const grouped = useMemo(() => {
		const result: Record<MemoryScopeType, MemoryEntry[]> = {
			namespace: [],
			flow: [],
			execution: [],
			unknown: [],
		};
		for (const entry of entries) {
			result[entry.scopeType].push(entry);
		}
		return result;
	}, [entries]);

	const chipGroups = SCOPE_ORDER.filter(
		(scopeType) => grouped[scopeType].length > 0
	).map((scopeType) => ({
		label: SCOPE_LABELS[scopeType] ?? scopeType,
		children: grouped[scopeType].map((entry) => (
			<MemoryChip
				key={entry.artifactId}
				label={entry.key.split("/").pop() ?? entry.key}
				scopeType={entry.scopeType}
				isDeleted={entry.isDeleted}
				isSelected={selectedKey === entry.key}
				onClick={() => onSelectKey(entry.key)}
			/>
		)),
	}));

	if (entries.length === 0) {
		return (
			<Empty className="h-full border-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Database01 className="size-5" />
					</EmptyMedia>
					<EmptyDescription>
						No memory keys accessed by this checkpoint
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<ChipBar groups={chipGroups} labelClassName="w-16" />

			{children ? (
				<div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
			) : (
				<div className="text-muted-foreground flex flex-1 items-center justify-center p-4 text-xs">
					Select a memory key to view
				</div>
			)}
		</div>
	);
}
