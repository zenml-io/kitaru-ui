import type { MemoryScopeInfo, MemoryScopeType } from "../domain/memory";
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
	activeScope: string;
	flowName: string;
	onScopeChange: (scope: string) => void;
};

const SCOPE_TYPE_ORDER: MemoryScopeType[] = [
	"flow",
	"namespace",
	"execution",
	"unknown",
];

const SCOPE_TYPE_LABELS: Record<MemoryScopeType, string> = {
	namespace: "Namespaces",
	flow: "Flows",
	execution: "Executions",
	unknown: "Other",
};

export function MemoryScopeSelector({
	scopes,
	activeScope,
	flowName,
	onScopeChange,
}: MemoryScopeSelectorProps) {
	const grouped = new Map<MemoryScopeType, MemoryScopeInfo[]>();
	for (const scope of scopes) {
		const list = grouped.get(scope.scopeType) ?? [];
		list.push(scope);
		grouped.set(scope.scopeType, list);
	}
	const orderedGroups = SCOPE_TYPE_ORDER.filter((t) => grouped.has(t));

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						className="w-full justify-between font-mono font-medium"
					>
						<span className="truncate">{activeScope}</span>
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
								key={s.scope}
								onClick={() => onScopeChange(s.scope)}
								className="flex items-center gap-2"
							>
								<span className="w-4 shrink-0">
									{s.scope === activeScope && <Check className="size-4" />}
								</span>
								<span className="min-w-0 flex-1 truncate font-mono font-medium">
									{s.scope}
								</span>
								{s.scope === flowName && (
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
