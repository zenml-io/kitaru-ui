import { fetchCurrentUser } from "@/modules/users/domain/fetch-current-user";
import { queryOptions } from "@tanstack/react-query";
import type { KitaruApiRuntime } from "@zenml/shared-kitaru/api";
import { fetchUserList } from "../domain/fetch-user-list";

export type UsersListQueryArgs = object;
export type CurrentUserQueryArgs = object;

export const userQueryKeys = {
	all: (scopeKey: string) => [scopeKey, "users"] as const,
	list: (scopeKey: string) => [...userQueryKeys.all(scopeKey)] as const,
	current: (scopeKey: string) => [scopeKey, "current-user"] as const,
};

export const userQueries = {
	currentUser: ({ kitaruApiClient, scopeKey }: KitaruApiRuntime) =>
		queryOptions({
			queryKey: userQueryKeys.current(scopeKey),
			queryFn: () => fetchCurrentUser({ kitaruApiClient }),
		}),
	list: ({ kitaruApiClient, scopeKey }: KitaruApiRuntime) =>
		queryOptions({
			queryKey: userQueryKeys.list(scopeKey),
			queryFn: () => fetchUserList({ kitaruApiClient }),
		}),
};
