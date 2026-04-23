import { Plus } from "lucide-react";

import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { Button } from "@/shared/ui/button";
import {
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui/card";
import { RefreshButton } from "@/shared/ui/RefreshButton";

type ApiKeysListHeaderContainerProps = {
	refetch: () => Promise<unknown>;
	onCreate: () => void;
};

export function ApiKeysListHeaderContainer({
	refetch,
	onCreate,
}: ApiKeysListHeaderContainerProps) {
	const { refresh, isPending: isRefreshing } = useManualRefresh(refetch);

	return (
		<CardHeader>
			<CardTitle className="text-lg font-semibold">API keys</CardTitle>
			<CardDescription>
				Create private credentials for automated agents and services.
			</CardDescription>
			<CardAction className="flex items-center gap-4">
				<RefreshButton
					variant="outline"
					isLoading={isRefreshing}
					onClick={refresh}
				/>
				<Button onClick={onCreate}>
					<Plus className="size-4" />
					Create API key
				</Button>
			</CardAction>
		</CardHeader>
	);
}
