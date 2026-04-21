import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

import { secretQueries } from "../business-logic/secret-queries";
import { SecretsTable } from "../ui/SecretsTable";
import { SecretRowActionsContainer } from "./SecretRowActionsContainer";
import { SecretsListHeaderContainer } from "./SecretsListHeaderContainer";

export function SecretsListPageContainer() {
	const [searchValue, setSearchValue] = useState("");
	const { data, refetch } = useSuspenseQuery(secretQueries.list());

	const query = searchValue.toLowerCase();
	const filtered = data.items.filter((secret) => {
		return (
			secret.name.toLowerCase().includes(query) ||
			secret.shortId.toLowerCase().includes(query)
		);
	});

	return (
		<Card>
			<SecretsListHeaderContainer refetch={refetch} />
			<CardContent className="space-y-6">
				<div className="relative w-full max-w-sm">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						placeholder="Search..."
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
						className="pl-9"
					/>
				</div>
				<SecretsTable
					secrets={filtered}
					renderActions={(secret) => (
						<SecretRowActionsContainer secret={secret} />
					)}
				/>
			</CardContent>
		</Card>
	);
}
