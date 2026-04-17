import { createFileRoute } from "@tanstack/react-router";

import { secretQueries } from "@/modules/secrets/business-logic/secret-queries";
import { SecretDetailPageContainer } from "@/modules/secrets/feature/SecretDetailPageContainer";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

export const Route = createFileRoute(
	"/_private/_navbar/settings/secrets/$secretId"
)({
	component: SecretDetailPageContainer,
	loader: async ({ context, params }) => {
		const secret = await context.queryClient.ensureQueryData(
			secretQueries.detail(params.secretId)
		);
		return {
			crumb: { label: secret.name, disabled: false },
		};
	},
	head: ({ loaderData }) => ({
		meta: [{ title: buildPageTitles(loaderData?.crumb.label ?? "Secret") }],
	}),
});
