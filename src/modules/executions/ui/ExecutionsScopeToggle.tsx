import { ToggleGroup, ToggleGroupItem } from "@zenml/hashi/primitives/toggle-group";

export type ExecutionsScope = "version" | "all";

export function ExecutionsScopeToggle({
	versionLabel,
	scope,
	onScopeChange,
}: {
	versionLabel: string;
	scope: ExecutionsScope;
	onScopeChange: (scope: ExecutionsScope) => void;
}) {
	return (
		<ToggleGroup
			value={scope}
			onValueChange={(next) => {
				if (next === "version" || next === "all") {
					onScopeChange(next);
				}
			}}
			variant="outline"
			size="sm"
			spacing={0}
		>
			<ToggleGroupItem value="version" className="font-mono">
				{versionLabel}
			</ToggleGroupItem>
			<ToggleGroupItem value="all">All versions</ToggleGroupItem>
		</ToggleGroup>
	);
}
