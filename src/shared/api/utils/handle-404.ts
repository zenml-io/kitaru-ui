import { notFound } from "@tanstack/react-router";
import { isFetchError } from "../domain/fetch-error";

/**
 * Wraps a query promise and throws TanStack Router's notFound()
 * if the query fails with a 404 status.
 *
 * Use this for the "primary resource" query in a loader - the one
 * that determines whether the route should exist.
 */
export async function ensureQueryDataOr404<T>(promise: Promise<T>): Promise<T> {
	try {
		return await promise;
	} catch (error) {
		if (isFetchError(error) && error.status === 404) {
			throw notFound();
		}
		throw error;
	}
}
