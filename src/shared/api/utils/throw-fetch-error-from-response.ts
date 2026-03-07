import { isArray, isObject, isString } from "es-toolkit/compat";
import { FetchError } from "../domain/fetch-error";

function getErrorMessage(errorData: unknown): string {
	if (isString(errorData) && errorData.trim().length > 0) {
		return errorData;
	}

	if (isArray(errorData)) {
		const secondItem = errorData[1];
		if (isString(secondItem) && secondItem.trim().length > 0) {
			return secondItem;
		}

		const arrayMessage = errorData.find(
			(item): item is string => isString(item) && item.trim().length > 0
		);
		if (arrayMessage) {
			return arrayMessage;
		}

		return "Unknown error";
	}

	if (isObject(errorData)) {
		const errorRecord = errorData as Record<string, unknown>;
		const detail = errorRecord.detail;
		if (isString(detail) && detail.trim().length > 0) {
			return detail;
		}

		if (isArray(detail)) {
			const detailMessage = detail.find(
				(item): item is string => isString(item) && item.trim().length > 0
			);
			if (detailMessage) {
				return detailMessage;
			}
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
