import { fetchCurrentUser } from "@/modules/users/domain/fetch-current-user";
import { queryOptions } from "@tanstack/react-query";
import { fetchUserList } from "../domain/fetch-user-list";

export const userQueryKeys = {
	all: ["users"] as const,
	current: ["current-user"] as const,
};

export const userQueries = {
	currentUser: () =>
		queryOptions({
			queryKey: userQueryKeys.current,
			queryFn: fetchCurrentUser,
		}),
	list: () =>
		queryOptions({
			queryKey: [...userQueryKeys.all],
			queryFn: fetchUserList,
		}),
};
