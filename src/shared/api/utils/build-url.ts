import { buildQueryString } from "./querystrings";

export function buildUrlWithQueries(
	url: string,
	queries: Record<string, unknown>
) {
	const queryString = buildQueryString(queries);
	return url + (queryString ? `?${queryString}` : "");
}
