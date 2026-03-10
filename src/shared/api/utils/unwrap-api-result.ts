import { FetchError } from "@/shared/api/domain/fetch-error";

type ApiResult<T, E> = {
	data?: T;
	error?: E;
	response: Response;
};

export function expectOptionalData<T, E>(
	result: ApiResult<T, E>
): T | undefined {
	if (result.error !== undefined) {
		throw new FetchError({
			status: result.response.status,
			statusText: "Error while fetching data",
			message: `Error while fetching data: ${result.response.url}`,
			url: result.response.url,
			details: result,
		});
	}

	return result.data;
}

export function expectData<T, E>(result: ApiResult<T, E>): T {
	const data = expectOptionalData(result);
	if (data !== undefined) {
		return data;
	}

	throw new FetchError({
		status: result.response.status,
		statusText: "INVARIANT_VIOLATION",
		message: `Invariant violation:  ${result.response.url} returned neither data nor error`,
		url: result.response.url,
		details: result,
	});
}
