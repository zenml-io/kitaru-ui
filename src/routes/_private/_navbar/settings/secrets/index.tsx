import { createFileRoute } from "@tanstack/react-router";

import { secretQueries } from "@/modules/secrets/business-logic/secret-queries";
import { SecretsListPageContainer } from "@/modules/secrets/feature/SecretsListPageContainer";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

export const Route = createFileRoute("/_private/_navbar/settings/secrets/")({
	component: SecretsListPageContainer,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(secretQueries.list());
	},
	head: () => ({
		meta: [{ title: buildPageTitles("Secrets") }],
	}),
});
