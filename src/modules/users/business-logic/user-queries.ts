import { fetchCurrentUser } from "@/modules/users/domain/fetch-current-user";
import { queryOptions } from "@tanstack/react-query";

export const userQueryKeys = {
	current: ["current-user"] as const,
};

export const userQueries = {
	currentUser: () =>
		queryOptions({
			queryKey: userQueryKeys.current,
			queryFn: fetchCurrentUser,
		}),
};
