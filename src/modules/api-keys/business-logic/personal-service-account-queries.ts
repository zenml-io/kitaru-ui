import { queryOptions, type UseQueryOptions } from "@tanstack/react-query";
import type { KitaruApiRuntime } from "@zenml/shared-kitaru/api";

import { findPersonalServiceAccount } from "../domain/find-or-create-personal-service-account";

export type PersonalServiceAccountQueryParams = {
	userId: string;
};

export type PersonalServiceAccountQueryConfig = Omit<
	UseQueryOptions<Awaited<ReturnType<typeof findPersonalServiceAccount>>>,
	"queryKey" | "queryFn"
>;

export const personalServiceAccountQueryKeys = {
	all: (scopeKey: string) => [scopeKey, "personal-service-account"] as const,
	resolve: (scopeKey: string, userId: string) =>
		[...personalServiceAccountQueryKeys.all(scopeKey), userId] as const,
};

export const personalServiceAccountQueries = {
	resolve: (
		{ userId }: PersonalServiceAccountQueryParams,
		{ kitaruApiClient, scopeKey }: KitaruApiRuntime,
		config: PersonalServiceAccountQueryConfig = {}
	) =>
		queryOptions({
			queryKey: personalServiceAccountQueryKeys.resolve(scopeKey, userId),
			queryFn: () =>
				findPersonalServiceAccount({ userId }, { kitaruApiClient }),
			...config,
		}),
};
