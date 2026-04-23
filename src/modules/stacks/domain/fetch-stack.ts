import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Stack, stackFromApiToDomain } from "./stack";

export async function fetchStack(stackId: string): Promise<Stack> {
	const response = await apiClient.GET("/api/v1/stacks/{stack_id}", {
		params: {
			path: { stack_id: stackId },
			query: { hydrate: true },
		},
	});
	return stackFromApiToDomain(expectData(response));
}
