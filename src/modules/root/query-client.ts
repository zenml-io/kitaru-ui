import { isFetchError } from "@/shared/api/domain/fetch-error";
import { QueryCache, QueryClient } from "@tanstack/react-query";

function getNextPath() {
	const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
	return encodeURIComponent(next);
}

function redirectToLogin() {
	if (window.location.pathname === "/login") {
		return;
	}

	window.location.assign(`/login?next=${getNextPath()}`);
}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			if (isFetchError(error) && error.status === 401) {
				redirectToLogin();
			}
		},
	}),
});
