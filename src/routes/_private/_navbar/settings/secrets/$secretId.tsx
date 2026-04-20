import { createFileRoute } from "@tanstack/react-router";

import { secretQueries } from "@/modules/secrets/business-logic/secret-queries";
import { SecretDetailPageContainer } from "@/modules/secrets/feature/SecretDetailPageContainer";
import { DefaultPageNotFound } from "@/modules/root/ui/DefaultPageNotFound";
import { ensureQueryDataOr404 } from "@/shared/router/utils/ensure-query-data-or-404";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

export const Route = createFileRoute(
	"/_private/_navbar/settings/secrets/$secretId"
)({
	component: SecretDetailPageContainer,
	notFoundComponent: DefaultPageNotFound,
	loader: async ({ context, params }) => {
		const secret = await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(secretQueries.detail(params.secretId))
		);
		return {
			crumb: { label: secret.name, disabled: false },
		};
	},
	head: ({ loaderData }) => ({
		meta: [{ title: buildPageTitles(loaderData?.crumb.label ?? "Secret") }],
	}),
});
