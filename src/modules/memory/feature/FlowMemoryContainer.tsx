import { useParams } from "@tanstack/react-router";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import { useMemoryScopes } from "@/modules/memory/business-logic/use-memory-scopes";
import { useMemories } from "@/modules/memory/business-logic/use-memories";
import { useMemoryHistory } from "@/modules/memory/business-logic/use-memory-history";
import { formatRelativeTime } from "@/shared/utils/time";

export function FlowMemoryContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});

	const { flowData } = useFlow(flowId);
	const activeScope = flowData.name;

	const { memoryScopesData } = useMemoryScopes();
	const { memoryEntriesData } = useMemories(activeScope);

	const selectedKey = memoryEntriesData[0]?.key;
	const { memoryHistoryData } = useMemoryHistory(activeScope, selectedKey);

	return (
		<div className="flex flex-col gap-6 p-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-lg font-semibold">Memory</h2>
				<p className="text-muted-foreground text-sm">
					Scope:{" "}
					<code className="bg-muted rounded px-1.5 py-0.5 text-xs">
						{activeScope}
					</code>
				</p>
			</div>

			<div className="text-muted-foreground flex gap-6 text-sm">
				<span>
					{memoryScopesData.length}{" "}
					{memoryScopesData.length === 1 ? "scope" : "scopes"} discovered
				</span>
				<span>
					{memoryEntriesData.length}{" "}
					{memoryEntriesData.length === 1 ? "entry" : "entries"} in current
					scope
				</span>
				{memoryHistoryData && (
					<span>
						{memoryHistoryData.length}{" "}
						{memoryHistoryData.length === 1 ? "version" : "versions"} for
						selected key
					</span>
				)}
			</div>

			{memoryEntriesData.length === 0 ? (
				<p className="text-muted-foreground py-8 text-center text-sm">
					No memory yet for this scope.
				</p>
			) : (
				<div className="border-border divide-border divide-y rounded-md border">
					{memoryEntriesData.map((entry) => (
						<div
							key={entry.artifactId}
							className="flex items-center gap-4 px-4 py-3"
						>
							<span className="min-w-0 flex-1 truncate font-medium">
								{entry.key}
							</span>
							<code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
								{entry.valueType}
							</code>
							<span className="text-muted-foreground font-mono text-xs tabular-nums">
								v{entry.version}
							</span>
							<span className="text-muted-foreground text-xs">
								{formatRelativeTime(entry.createdAt)}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
