import type { JsonSchema } from "@/shared/api/domain/json-schema";
import type { components } from "@/shared/api/openapi";
import { isRecord } from "@/shared/utils/is-record";

const fallbackParametersSchema: JsonSchema = {
	type: "object",
	additionalProperties: true,
};

export type RunConfiguration =
	components["schemas"]["PipelineRunConfiguration"];

export function getEditableParameters(
	configTemplate: Record<string, unknown> | null | undefined
): Record<string, unknown> {
	if (!isRecord(configTemplate)) return {};
	const parameters = configTemplate.parameters;
	return isRecord(parameters) ? { ...parameters } : {};
}

export function getParametersJsonSchema(
	configSchema: JsonSchema | null | undefined
): JsonSchema {
	if (!configSchema) return { ...fallbackParametersSchema };

	const properties = configSchema.properties;
	const parametersSchema = isRecord(properties)
		? properties.parameters
		: undefined;
	if (!isRecord(parametersSchema)) return { ...fallbackParametersSchema };

	return {
		...configSchema,
		...parametersSchema,
	};
}

export function mergeRunConfigurationWithParameters(
	configTemplate: Record<string, unknown> | null | undefined,
	parameters: Record<string, unknown>
): RunConfiguration {
	return {
		...(isRecord(configTemplate) ? configTemplate : {}),
		parameters,
	};
}
