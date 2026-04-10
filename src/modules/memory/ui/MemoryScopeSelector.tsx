import { useMemo } from "react";
import type {
	MemoryScopeIdentity,
	MemoryScopeInfo,
	MemoryScopeType,
} from "../domain/memory";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ChevronDown, Check } from "@untitledui/icons";

type MemoryScopeSelectorProps = {
	scopes: MemoryScopeInfo[];
	activeScope: MemoryScopeIdentity;
	flowScope: MemoryScopeIdentity;
	onScopeChange: (scope: MemoryScopeIdentity) => void;
};

const SCOPE_TYPE_ORDER: MemoryScopeType[] = [
	"namespace",
	"flow",
	"execution",
	"unknown",
];

const SCOPE_TYPE_LABELS: Record<MemoryScopeType, string> = {
	namespace: "Namespaces",
	flow: "Flows",
	execution: "Executions",
	unknown: "Other",
};

function isSameScope(a: MemoryScopeIdentity, b: MemoryScopeIdentity) {
	return a.scope === b.scope && a.scopeType === b.scopeType;
}

export function MemoryScopeSelector({
	scopes,
	activeScope,
	flowScope,
	onScopeChange,
}: MemoryScopeSelectorProps) {
	const { grouped, orderedGroups } = useMemo(() => {
		const g = new Map<MemoryScopeType, MemoryScopeInfo[]>();
		for (const scope of scopes) {
			const list = g.get(scope.scopeType) ?? [];
			list.push(scope);
			g.set(scope.scopeType, list);
		}
		return {
			grouped: g,
			orderedGroups: SCOPE_TYPE_ORDER.filter((t) => g.has(t)),
		};
	}, [scopes]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						className="w-full justify-between gap-2 font-mono font-medium"
					>
						<span className="min-w-0 flex-1 truncate">{activeScope.scope}</span>
						<Badge variant="secondary" className="text-2xs shrink-0">
							{activeScope.scopeType}
						</Badge>
						<ChevronDown className="ml-1 size-4 shrink-0 opacity-50" />
					</Button>
				}
			/>
			<DropdownMenuContent align="start" className="min-w-80">
				{orderedGroups.map((scopeType) => (
					<DropdownMenuGroup key={scopeType}>
						<DropdownMenuLabel>
							{SCOPE_TYPE_LABELS[scopeType]}
						</DropdownMenuLabel>
						{grouped.get(scopeType)!.map((s) => (
							<DropdownMenuItem
								key={`${s.scopeType}:${s.scope}`}
								onClick={() => onScopeChange(s)}
								className="flex items-center gap-2"
							>
								<span className="w-4 shrink-0">
									{isSameScope(s, activeScope) && <Check className="size-4" />}
								</span>
								<span className="min-w-0 flex-1 truncate font-mono font-medium">
									{s.scope}
								</span>
								{isSameScope(s, flowScope) && (
									<Badge variant="secondary" className="text-2xs shrink-0">
										this flow
									</Badge>
								)}
								<span className="text-muted-foreground shrink-0 text-xs tabular-nums">
									{s.entryCount} {s.entryCount === 1 ? "key" : "keys"}
								</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
