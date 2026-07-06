import { createFileRoute, Link } from "@tanstack/react-router";

import {
	secretQueries,
	SecretsListPageContainer,
	SecretsListRouteProvider,
	type SecretLinkProps,
} from "@zenml/shared-kitaru/modules/secrets";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

export const Route = createFileRoute("/_private/_navbar/settings/secrets/")({
	component: SecretsListRouteAdapter,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(secretQueries.list(context));
	},
	head: () => ({
		meta: [{ title: buildPageTitles("Secrets") }],
	}),
});

function LinkToSecret({ secretId, className, children }: SecretLinkProps) {
	return (
		<Link
			to="/settings/secrets/$secretId"
			params={{ secretId }}
			className={className}
		>
			{children}
		</Link>
	);
}

function SecretsListRouteAdapter() {
	return (
		<SecretsListRouteProvider navigation={{ LinkToSecret }}>
			<SecretsListPageContainer />
		</SecretsListRouteProvider>
	);
}
