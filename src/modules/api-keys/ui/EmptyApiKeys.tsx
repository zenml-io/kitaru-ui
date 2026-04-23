import { KeyRound, Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

type EmptyApiKeysProps = {
	onCreate: () => void;
};

export function EmptyApiKeys({ onCreate }: EmptyApiKeysProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
			<div className="bg-muted flex size-12 items-center justify-center rounded-full">
				<KeyRound className="text-muted-foreground size-6" />
			</div>
			<div className="space-y-1">
				<p className="text-lg font-semibold">Create a new API key</p>
				<p className="text-muted-foreground max-w-sm text-sm">
					An API key is a private credential for your kitaru account. Use it for
					secure automation with the API or SDK.
				</p>
			</div>
			<Button onClick={onCreate}>
				<Plus className="size-4" /> Create API key
			</Button>
		</div>
	);
}
