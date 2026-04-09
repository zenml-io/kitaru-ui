import { useMemo } from "react";
import { Database01 } from "@untitledui/icons";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
} from "@/shared/ui/empty";
import type { MemoryEntry, MemoryScopeType } from "../domain/memory";
import { MemoryChip } from "./MemoryChip";

const SCOPE_ORDER: MemoryScopeType[] = ["namespace", "flow", "execution"];

const SCOPE_ABBREVIATIONS: Record<string, string> = {
	namespace: "NS",
	flow: "Flow",
	execution: "Exec",
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
			{/* Chip bar grouped by scope */}
			<div className="border-border shrink-0 space-y-1.5 border-b px-4 py-2">
				{SCOPE_ORDER.map((scopeType) => {
					const scopeEntries = grouped[scopeType];
					if (scopeEntries.length === 0) return null;
					return (
						<div
							key={scopeType}
							className="flex flex-wrap items-center gap-1.5"
						>
							<span className="text-muted-foreground text-2xs w-14 shrink-0 font-semibold tracking-wider uppercase">
								{SCOPE_ABBREVIATIONS[scopeType] ?? scopeType}
							</span>
							{scopeEntries.map((entry) => (
								<MemoryChip
									key={entry.artifactId}
									label={entry.key.split("/").pop() ?? entry.key}
									scopeType={entry.scopeType}
									isDeleted={entry.isDeleted}
									isSelected={selectedKey === entry.key}
									onClick={() => onSelectKey(entry.key)}
								/>
							))}
						</div>
					);
				})}
			</div>

			{/* Selected key content */}
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
