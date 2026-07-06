import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
	secretQueries,
	SecretDetailPageContainer,
	SecretDetailRouteProvider,
} from "@zenml/shared-kitaru/modules/secrets";
import { DefaultPageNotFound } from "@/modules/root/ui/DefaultPageNotFound";
import { ensureQueryDataOr404 } from "@/shared/router/utils/ensure-query-data-or-404";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

export const Route = createFileRoute(
	"/_private/_navbar/settings/secrets/$secretId"
)({
	component: SecretDetailRouteAdapter,
	notFoundComponent: DefaultPageNotFound,
	loader: async ({ context, params }) => {
		const secret = await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(
				secretQueries.detail(
					{
						secretId: params.secretId,
					},
					context
				)
			)
		);
		return {
			crumb: { label: secret.name, disabled: false },
		};
	},
	head: ({ loaderData }) => ({
		meta: [{ title: buildPageTitles(loaderData?.crumb.label ?? "Secret") }],
	}),
});

function SecretDetailRouteAdapter() {
	const { secretId } = Route.useParams();
	const navigate = useNavigate();

	function redirectToList() {
		void navigate({ to: "/settings/secrets" });
	}

	return (
		<SecretDetailRouteProvider
			state={{ secretId }}
			navigation={{ redirectToList }}
		>
			<SecretDetailPageContainer />
		</SecretDetailRouteProvider>
	);
}
