import { isArray, isObject } from "es-toolkit/compat";

/**
 * Converts an object to a query string
 * - Filters out null and undefined values
 * - Handles arrays by creating multiple entries with the same key
 * - Stringifies objects using JSON.stringify
 * - Converts other non-string values using toString()
 *
 * @param object The object to convert to search parameters
 * @returns Query string
 */
export function buildQueryString(object: Record<string, unknown>): string {
	const searchParams = new URLSearchParams();

	// Process each key-value pair in the object
	Object.entries(object).forEach(([key, value]) => {
		// Skip null and undefined values
		if (value === null || value === undefined) {
			return;
		}

		// Handle arrays - add multiple entries with the same key
		if (isArray(value)) {
			value.forEach((item) => {
				if (item !== null && item !== undefined) {
					// Stringify objects within arrays
					if (typeof item === "object" && item !== null) {
						searchParams.append(key, JSON.stringify(item));
					} else {
						searchParams.append(key, String(item));
					}
				}
			});
		}
		// Handle plain objects by stringifying them
		else if (isObject(value)) {
			searchParams.append(key, JSON.stringify(value));
		}
		// Handle all other types by converting to string
		else {
			searchParams.append(key, String(value));
		}
	});

	return searchParams.toString();
}
