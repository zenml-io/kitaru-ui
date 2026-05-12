import { Plus } from "lucide-react";
import { useState } from "react";

import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { Button } from "@/shared/ui/button";
import {
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui/card";
import { RefreshButton } from "@/shared/ui/RefreshButton";

import { SecretFormDialogContainer } from "./SecretFormDialogContainer";

type Props = {
	refetch: () => Promise<unknown>;
};

export function SecretsListHeaderContainer({ refetch }: Props) {
	const [createOpen, setCreateOpen] = useState(false);
	const { refresh, isPending: isManualRefreshPending } =
		useManualRefresh(refetch);

	return (
		<CardHeader>
			<CardTitle className="text-lg font-semibold">Secrets</CardTitle>
			<CardDescription>
				Configure and manage your pipeline secrets and configurations.
			</CardDescription>
			<CardAction className="flex items-center gap-4">
				<RefreshButton
					variant="outline"
					isLoading={isManualRefreshPending}
					onClick={refresh}
				/>
				<Button onClick={() => setCreateOpen(true)}>
					<Plus className="size-4" />
					Add secret
				</Button>
			</CardAction>
			{createOpen && (
				<SecretFormDialogContainer
					mode="add"
					open={createOpen}
					onOpenChange={setCreateOpen}
				/>
			)}
		</CardHeader>
	);
}
