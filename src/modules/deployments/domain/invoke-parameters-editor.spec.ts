import { describe, expect, it } from "vitest";
import type { JsonSchema } from "@/shared/api/domain/json-schema";
import {
	getEditableParameters,
	getParametersJsonSchema,
	mergeRunConfigurationWithParameters,
} from "./invoke-parameters-editor";

describe("getEditableParameters", () => {
	it("returns only the parameters section from run configuration template", () => {
		const result = getEditableParameters({
			run_name: "demo-run",
			parameters: { topic: "hello", limit: 3 },
		});

		expect(result).toEqual({ topic: "hello", limit: 3 });
	});

	it("returns an empty object when parameters are missing or invalid", () => {
		expect(getEditableParameters(undefined)).toEqual({});
		expect(
			getEditableParameters({
				run_name: "demo-run",
			})
		).toEqual({});
		expect(
			getEditableParameters({
				parameters: ["not-an-object"],
			})
		).toEqual({});
	});
});

describe("getParametersJsonSchema", () => {
	it("replaces root properties with parameters.properties while preserving root keys", () => {
		const schema: JsonSchema = {
			type: "object",
			required: ["parameters"],
			additionalProperties: false,
			properties: {
				parameters: {
					type: "object",
					required: ["topic"],
					properties: {
						topic: { $ref: "#/$defs/topicType" },
					},
				},
			},
			$defs: {
				topicType: { type: "string" },
			},
			definitions: {
				legacyType: { type: "number" },
			},
		};

		const result = getParametersJsonSchema(schema);

		expect(result.type).toBe("object");
		expect(result.required).toEqual(["topic"]);
		expect(result.additionalProperties).toBe(false);
		expect(result.properties).toEqual({
			topic: { $ref: "#/$defs/topicType" },
		});
		expect((result as Record<string, unknown>).$defs).toEqual({
			topicType: { type: "string" },
		});
		expect(result.definitions).toEqual({
			legacyType: { type: "number" },
		});
	});

	it("falls back to an open object schema when parameters schema is absent", () => {
		const result = getParametersJsonSchema(undefined);
		expect(result).toMatchObject({
			type: "object",
			additionalProperties: true,
		});
	});
});

describe("mergeRunConfigurationWithParameters", () => {
	it("keeps defaults and replaces parameters with edited values", () => {
		const result = mergeRunConfigurationWithParameters(
			{
				run_name: "demo-run",
				enable_cache: true,
				parameters: { old: "value" },
			},
			{ topic: "new-value" }
		);

		expect(result).toEqual({
			run_name: "demo-run",
			enable_cache: true,
			parameters: { topic: "new-value" },
		});
	});

	it("creates a minimal run configuration when template is missing", () => {
		const result = mergeRunConfigurationWithParameters(undefined, {
			foo: "bar",
		});
		expect(result).toEqual({ parameters: { foo: "bar" } });
	});
});
