import { isArray } from "es-toolkit/compat";

export function buildUrlWithQueries(
	url: string,
	queries: Record<string, unknown>
) {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(queries)) {
		if (value === null || value === undefined) {
			continue;
		}

		if (isArray(value)) {
			for (const item of value) {
				if (item === null || item === undefined) {
					continue;
				}
				searchParams.append(key, String(item));
			}
			continue;
		}

		searchParams.append(key, String(value));
	}

	const queryString = searchParams.toString();

	return queryString ? `${url}?${queryString}` : url;
}
