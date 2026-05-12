import { createFileRoute } from "@tanstack/react-router";

import { apiKeyQueries } from "@/modules/api-keys/business-logic/api-key-queries";
import { personalServiceAccountQueries } from "@/modules/api-keys/business-logic/personal-service-account-queries";
import { ApiKeysPageContainer } from "@/modules/api-keys/feature/ApiKeysPageContainer";
import { userQueries } from "@/modules/users/business-logic/user-queries";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

export const Route = createFileRoute("/_private/_navbar/settings/api-keys")({
	component: ApiKeysPageContainer,
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			userQueries.currentUser()
		);
		const sa = await context.queryClient.ensureQueryData(
			personalServiceAccountQueries.resolve(user.id)
		);
		if (sa) {
			await context.queryClient.ensureQueryData(apiKeyQueries.list(sa.id));
		}
		return {
			crumb: { label: "API keys", disabled: false },
		};
	},
	head: () => ({
		meta: [{ title: buildPageTitles("API keys") }],
	}),
});
