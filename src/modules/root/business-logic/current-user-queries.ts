import { fetchCurrentUser } from "@/modules/root/domain/fetch-current-user";
import { queryOptions } from "@tanstack/react-query";

export const currentUserQueryKeys = {
	all: ["current-user"] as const,
	detail: () => [...currentUserQueryKeys.all] as const,
};

export const currentUserQueries = {
	detail: () =>
		queryOptions({
			queryKey: currentUserQueryKeys.detail(),
			queryFn: fetchCurrentUser,
		}),
};
