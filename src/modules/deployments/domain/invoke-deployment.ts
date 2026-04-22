import { env } from "@/modules/root/domain/env";
import { getCsrfToken } from "@/shared/api/utils/csrf-token-cookie";

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
	const csrfToken = getCsrfToken();
	const response = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"Source-Context": "kitaru-ui",
			...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
		},
		body: JSON.stringify({ run_configuration: { parameters } }),
	});
	if (!response.ok) {
		let detail: string;
		try {
			const payload = (await response.json()) as { detail?: unknown };
			detail =
				typeof payload.detail === "string"
					? payload.detail
					: JSON.stringify(payload);
		} catch {
			detail = await response.text();
		}
		throw new Error(`Invoke failed (${response.status}): ${detail}`);
	}
	const body = (await response.json()) as { id: string };
	return { runId: body.id };
}
