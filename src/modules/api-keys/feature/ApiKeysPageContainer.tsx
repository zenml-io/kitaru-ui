import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { userQueries } from "@/modules/users/business-logic/user-queries";
import { Card, CardContent } from "@/shared/ui/card";

import { apiKeyQueries } from "../business-logic/api-key-queries";
import { personalServiceAccountQueries } from "../business-logic/personal-service-account-queries";
import { ApiKeysTable } from "../ui/ApiKeysTable";
import { EmptyApiKeys } from "../ui/EmptyApiKeys";
import { ApiKeyActiveToggleContainer } from "./ApiKeyActiveToggleContainer";
import { ApiKeyRowActionsContainer } from "./ApiKeyRowActionsContainer";
import { ApiKeysListHeaderContainer } from "./ApiKeysListHeaderContainer";
import { CreateApiKeyDialogContainer } from "./CreateApiKeyDialogContainer";

export function ApiKeysPageContainer() {
	const { data: currentUser } = useSuspenseQuery(userQueries.currentUser());
	const { data: personalSa } = useSuspenseQuery(
		personalServiceAccountQueries.resolve(currentUser.id)
	);
	const [createOpen, setCreateOpen] = useState(false);

	const hasServiceAccount = personalSa !== null;
	const { data, refetch } = useQuery({
		...apiKeyQueries.list(personalSa?.id ?? ""),
		enabled: hasServiceAccount,
	});

	const items = data?.items ?? [];

	return (
		<Card>
			<ApiKeysListHeaderContainer
				refetch={refetch}
				onCreate={() => setCreateOpen(true)}
			/>
			<CardContent className="space-y-6">
				{hasServiceAccount && items.length > 0 ? (
					<ApiKeysTable
						apiKeys={items}
						renderActiveCell={(apiKey) => (
							<ApiKeyActiveToggleContainer
								serviceAccountId={personalSa.id}
								apiKey={apiKey}
							/>
						)}
						renderActions={(apiKey) => (
							<ApiKeyRowActionsContainer
								serviceAccountId={personalSa.id}
								apiKey={apiKey}
							/>
						)}
					/>
				) : (
					<EmptyApiKeys onCreate={() => setCreateOpen(true)} />
				)}
			</CardContent>
			{createOpen && (
				<CreateApiKeyDialogContainer
					open={createOpen}
					onOpenChange={setCreateOpen}
					userId={currentUser.id}
					serviceAccountId={personalSa?.id}
				/>
			)}
		</Card>
	);
}
