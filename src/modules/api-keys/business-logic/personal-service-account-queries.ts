import { queryOptions } from "@tanstack/react-query";

import { findPersonalServiceAccount } from "../domain/find-or-create-personal-service-account";

export const personalServiceAccountQueryKeys = {
	all: ["personal-service-account"] as const,
	resolve: (userId: string) =>
		[...personalServiceAccountQueryKeys.all, userId] as const,
};

export const personalServiceAccountQueries = {
	resolve: (userId: string) =>
		queryOptions({
			queryKey: personalServiceAccountQueryKeys.resolve(userId),
			queryFn: () => findPersonalServiceAccount(userId),
		}),
};
