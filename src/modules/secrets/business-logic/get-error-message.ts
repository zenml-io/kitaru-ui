import { isFetchError } from "@/shared/api/domain/fetch-error";
import { isRecord } from "@/shared/utils/is-record";

export function getErrorMessage(error: unknown, fallback: string): string {
	if (isFetchError(error)) {
		const fromDetails = extractDetail(error.details);
		if (fromDetails) return fromDetails;
		if (error.status === 409) return "A secret with this name already exists.";
		if (error.status === 403) return "You don't have permission to do that.";
		if (error.status === 404) return "This secret no longer exists.";
	}
	if (
		error instanceof Error &&
		!error.message.startsWith("Error while fetching")
	) {
		return error.message;
	}
	return fallback;
}

function extractDetail(details: unknown): string | undefined {
	if (!isRecord(details)) return undefined;
	const inner = details.error;
	if (!isRecord(inner)) return undefined;
	const detail = inner.detail;
	if (typeof detail === "string" && detail.trim().length > 0) return detail;
	return undefined;
}
