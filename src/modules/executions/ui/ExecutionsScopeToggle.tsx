import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

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
			value={[scope]}
			onValueChange={(next) => {
				const candidate = next[0];
				if (candidate === "version" || candidate === "all") {
					onScopeChange(candidate);
				}
			}}
			variant="outline"
			size="sm"
			spacing={0}
		>
			<ToggleGroupItem
				value="version"
				className="aria-pressed:bg-primary aria-pressed:text-primary-foreground font-mono"
			>
				{versionLabel}
			</ToggleGroupItem>
			<ToggleGroupItem
				value="all"
				className="aria-pressed:bg-primary aria-pressed:text-primary-foreground"
			>
				All versions
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
