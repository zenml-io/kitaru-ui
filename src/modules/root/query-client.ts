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
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			if (isFetchError(error) && error.status === 401) {
				redirectToLogin();
			}
		},
	}),
});

declare global {
	interface Window {
		__TANSTACK_QUERY_CLIENT__?: QueryClient;
	}
}

if (import.meta.env.DEV) {
	window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}
