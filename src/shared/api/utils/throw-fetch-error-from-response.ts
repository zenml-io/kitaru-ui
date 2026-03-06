import { FetchError } from "../domain/fetch-error";

function getErrorMessage(errorData: unknown): string {
	if (typeof errorData === "string" && errorData.trim().length > 0) {
		return errorData;
	}

	if (errorData && typeof errorData === "object") {
		const errorRecord = errorData as Record<string, unknown>;
		const detail = errorRecord.detail;
		if (typeof detail === "string" && detail.trim().length > 0) {
			return detail;
		}

		if (Array.isArray(detail)) {
			const detailMessage = detail.find(
				(item): item is string =>
					typeof item === "string" && item.trim().length > 0
			);
			if (detailMessage) {
				return detailMessage;
			}
		}

		const message = errorRecord.message;
		if (typeof message === "string" && message.trim().length > 0) {
			return message;
		}
	}

	return "Error while fetching data";
}

export async function throwFetchErrorFromResponse({
	response,
	url,
	method,
}: {
	response: Response;
	url: string;
	method: string;
}): Promise<never> {
	const errorData = await response.json();

	throw new FetchError({
		status: response.status,
		statusText: response.statusText,
		message: getErrorMessage(errorData),
		details: errorData,
		url,
		method,
	});
}
