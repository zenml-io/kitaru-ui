import { useCurrentUser } from "@/modules/users/business-logic/use-current-user";
import { Card, CardContent } from "@zenml/hashi/primitives/card";
import { useState } from "react";
import { useApiKeys } from "../business-logic/use-api-keys";
import { usePersonalServiceAccount } from "../business-logic/use-personal-service-account";
import { ApiKeysTable } from "../ui/ApiKeysTable";
import { EmptyApiKeys } from "../ui/EmptyApiKeys";
import { ApiKeyActiveToggleContainer } from "./ApiKeyActiveToggleContainer";
import { ApiKeyRowActionsContainer } from "./ApiKeyRowActionsContainer";
import { ApiKeysListHeaderContainer } from "./ApiKeysListHeaderContainer";
import { CreateApiKeyDialogContainer } from "./CreateApiKeyDialogContainer";

export function ApiKeysPageContainer() {
	const { currentUserData: currentUser } = useCurrentUser();
	const { personalServiceAccountData: personalSa } = usePersonalServiceAccount(
		currentUser.id
	);
	const [createOpen, setCreateOpen] = useState(false);

	const hasServiceAccount = personalSa !== null;
	const { apiKeysData, refetch } = useApiKeys(personalSa?.id ?? "", {
		enabled: hasServiceAccount,
	});

	const items = apiKeysData?.items ?? [];

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
