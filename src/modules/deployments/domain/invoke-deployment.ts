import { env } from "@/modules/root/domain/env";
import { FetchError } from "@/shared/api/domain/fetch-error";
import { getCsrfToken } from "@/shared/api/utils/csrf-token-cookie";
import { isRecord } from "@/shared/utils/is-record";

export type InvokeDeploymentArgs = {
	snapshotId: string;
	parameters: Record<string, unknown>;
};

export type InvokeDeploymentResult = { runId: string };

export async function invokeDeployment({
	snapshotId,
	parameters,
}: InvokeDeploymentArgs): Promise<InvokeDeploymentResult> {
	const origin = env.VITE_API_BASE_URL || "";
	const url = `${origin}/api/v1/pipeline_snapshots/${snapshotId}/runs`;
	const method = "POST";
	const csrfToken = getCsrfToken();

	let response: Response;
	try {
		response = await fetch(url, {
			method,
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				"Source-Context": "kitaru-ui",
				...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
			},
			body: JSON.stringify({ run_configuration: { parameters } }),
		});
	} catch (error) {
		throw new FetchError({
			status: 0,
			statusText: "REQUEST_FAILED",
			message: "Request failed before receiving a response",
			url,
			method,
			cause: error,
		});
	}

	const rawBody = await response.text();
	const parsed = safeJsonParse(rawBody);

	if (!response.ok) {
		throw new FetchError({
			status: response.status,
			statusText: response.statusText,
			message: extractErrorMessage(parsed, rawBody, response.status),
			details: parsed ?? rawBody,
			url,
			method,
		});
	}

	const runId =
		isRecord(parsed) && typeof parsed.id === "string" ? parsed.id : undefined;
	if (!runId) {
		throw new FetchError({
			status: response.status,
			statusText: "INVALID_INVOKE_RESPONSE",
			message: "Invoke response missing run id",
			details: parsed ?? rawBody,
			url,
			method,
		});
	}

	return { runId };
}

function safeJsonParse(text: string): unknown {
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

function extractErrorMessage(
	parsed: unknown,
	rawBody: string,
	status: number
): string {
	if (isRecord(parsed)) {
		const detail = parsed.detail;
		if (typeof detail === "string" && detail.trim().length > 0) return detail;
		return `Invoke failed (${status}): ${JSON.stringify(parsed)}`;
	}
	if (rawBody.trim().length > 0) return `Invoke failed (${status}): ${rawBody}`;
	return `Invoke failed (${status})`;
}
