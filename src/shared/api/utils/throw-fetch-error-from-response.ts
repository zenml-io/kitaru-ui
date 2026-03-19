import { isArray, isString } from "es-toolkit/compat";
import { FetchError } from "../domain/fetch-error";
import { isRecord } from "@/shared/utils/is-record";

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

function getErrorMessage(errorData: unknown): string {
	if (isString(errorData) && errorData.trim().length > 0) {
		return errorData;
	}

	if (isArray(errorData)) {
		const message = errorData[1];
		if (isString(message) && message.trim().length > 0) {
			return message;
		}

		const arrayMessage = errorData.find(
			(item): item is string => isString(item) && item.trim().length > 0
		);
		if (arrayMessage) {
			return arrayMessage;
		}

		return "Unknown error";
	}

	if (isRecord(errorData)) {
		const detail = errorData.detail;
		if (isString(detail) && detail.trim().length > 0) {
			return detail;
		}

		if (isArray(detail)) {
			const message = detail[1];
			if (isString(message) && message.trim().length > 0) {
				return message;
			}

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
