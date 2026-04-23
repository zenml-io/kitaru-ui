import { CopyCommand } from "@/shared/ui/CopyCommand";
import { WarningBanner } from "@/shared/ui/WarningBanner";

type ApiKeyRevealPanelProps = {
	mode: "create" | "rotate";
	plaintextKey: string;
};

export function ApiKeyRevealPanel({
	mode,
	plaintextKey,
}: ApiKeyRevealPanelProps) {
	return (
		<div className="flex min-w-0 flex-col gap-4">
			<div>
				<p className="text-lg font-semibold">
					{mode === "create"
						? "Here is your new API key"
						: "Here is your rotated API key"}
				</p>
				<p className="text-muted-foreground text-sm">
					Your key was generated successfully.
				</p>
			</div>
			<WarningBanner>
				<p>
					<span className="font-semibold">Important:</span> this key cannot be
					retrieved later. Please copy it now. Keep your keys private and never
					share them.
				</p>
			</WarningBanner>
			<CopyCommand code={plaintextKey} className="text-sm" />
			<div className="bg-muted/40 text-muted-foreground rounded-md p-3 text-xs">
				<p className="text-foreground mb-1 font-medium">Example usage</p>
				<code className="block font-mono break-all whitespace-pre-wrap">
					curl -H &quot;Authorization: Bearer {plaintextKey}&quot;
					$KITARU_SERVER_URL
				</code>
			</div>
		</div>
	);
}
