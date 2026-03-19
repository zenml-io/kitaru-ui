import type { components } from "@/shared/api/openapi";

type ApiWaitCondition = components["schemas"]["RunWaitConditionResponse"];

export type WaitConditionStatus =
	components["schemas"]["RunWaitConditionStatus"];
export type WaitConditionType = components["schemas"]["RunWaitConditionType"];
export type WaitConditionResolution =
	components["schemas"]["RunWaitConditionResolution"];

export type WaitCondition = {
	id: string;
	name: string;
	type: WaitConditionType;
	status: WaitConditionStatus;
	question?: string;
	dataSchema?: Record<string, unknown>;
};

export function waitConditionFromApiToDomain(
	api: ApiWaitCondition
): WaitCondition {
	return {
		id: api.id,
		name: api.name,
		type: api.body!.type,
		status: api.body!.status,
		question: api.metadata?.question ?? undefined,
		dataSchema: api.metadata?.data_schema ?? undefined,
	};
}
