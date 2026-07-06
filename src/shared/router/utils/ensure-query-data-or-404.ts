import { notFound } from "@tanstack/react-router";
import { isFetchError } from "@zenml/shared-kitaru/api/domain";

/**
 * Wrap a query promise and throw TanStack Router's notFound()
 * when the request fails with a 404 status.
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
