import { TriangleAlert } from "lucide-react";

import { CopyCommand } from "@/shared/ui/CopyCommand";

type ApiKeyRevealPanelProps = {
	mode: "create" | "rotate";
	plaintextKey: string;
};

export function ApiKeyRevealPanel({
	mode,
	plaintextKey,
}: ApiKeyRevealPanelProps) {
	return (
		<div className="flex flex-col gap-4">
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
			<div className="bg-warning/10 text-warning-foreground border-warning/40 flex items-start gap-2 rounded-md border p-3 text-sm">
				<TriangleAlert className="text-warning mt-0.5 size-4 shrink-0" />
				<p>
					<span className="font-semibold">Important:</span> this key cannot be
					retrieved later. Please copy it now. Keep your keys private and never
					share them.
				</p>
			</div>
			<CopyCommand code={plaintextKey} className="text-sm" />
			<div className="bg-muted/40 text-muted-foreground rounded-md p-3 text-xs">
				<p className="text-foreground mb-1 font-medium">Example usage</p>
				<code className="block font-mono break-all whitespace-pre-wrap">
					curl -H &quot;Authorization: Bearer {plaintextKey}&quot; $ZENML_URL
				</code>
			</div>
		</div>
	);
}
