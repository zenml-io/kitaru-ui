import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { secretQueries } from "../business-logic/secret-queries";
import { SecretsTable } from "../ui/SecretsTable";
import { SecretsListToolbarContainer } from "./SecretsListToolbarContainer";

export function SecretsListPageContainer() {
	const [searchValue, setSearchValue] = useState("");
	const { data, refetch } = useSuspenseQuery(secretQueries.list());
	const { refresh, isPending: isManualRefreshPending } =
		useManualRefresh(refetch);

	const query = searchValue.toLowerCase();
	const filtered = data.items.filter((secret) => {
		return (
			secret.name.toLowerCase().includes(query) ||
			secret.shortId.toLowerCase().includes(query)
		);
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Secrets</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<SecretsListToolbarContainer
					isRefreshing={isManualRefreshPending}
					onRefresh={refresh}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
				/>
				<SecretsTable secrets={filtered} />
			</CardContent>
		</Card>
	);
}
