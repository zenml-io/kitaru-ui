import { describe, expect, it } from "vitest";
import type { components } from "@/shared/api/openapi";
import { buildFromApiToDomain, dockerImageFromApiToDomain } from "./build";

type PipelineBuildResponse = components["schemas"]["PipelineBuildResponse"];
type BuildItem = components["schemas"]["BuildItem"];

describe("dockerImageFromApiToDomain", () => {
	it("maps every field one-to-one", () => {
		const item: BuildItem = {
			image: "registry/zenml:abc",
			dockerfile: "FROM python\n",
			requirements: "boto3==1.0\n",
			settings_checksum: "ck",
			contains_code: true,
			requires_code_download: false,
		};
		expect(dockerImageFromApiToDomain(item)).toEqual({
			image: "registry/zenml:abc",
			dockerfile: "FROM python\n",
			requirements: "boto3==1.0\n",
			containsCode: true,
			requiresCodeDownload: false,
		});
	});

	it("preserves containsCode=false (does not coerce to default)", () => {
		const item = {
			image: "img",
			contains_code: false,
		} as BuildItem;
		expect(dockerImageFromApiToDomain(item).containsCode).toBe(false);
	});

	it("converts null dockerfile/requirements to undefined", () => {
		const item = {
			image: "img",
			dockerfile: null,
			requirements: null,
		} as unknown as BuildItem;
		const result = dockerImageFromApiToDomain(item);
		expect(result.dockerfile).toBeUndefined();
		expect(result.requirements).toBeUndefined();
	});

	it("passes through undefined containsCode and requiresCodeDownload when absent from API", () => {
		const item = { image: "img" } as BuildItem;
		const result = dockerImageFromApiToDomain(item);
		expect(result.containsCode).toBeUndefined();
		expect(result.requiresCodeDownload).toBeUndefined();
	});
});

describe("buildFromApiToDomain", () => {
	it("partitions images into orchestrator, perStep, and perStepOperator", () => {
		const api = {
			id: "build-1",
			metadata: {
				python_version: "3.11.6",
				zenml_version: "0.66.0",
				is_local: false,
				images: {
					orchestrator: { image: "orch-img" },
					train: { image: "train-img", dockerfile: "FROM python\n" },
					"train.sagemaker": { image: "train-sm-img" },
				},
			},
		} as unknown as PipelineBuildResponse;

		const result = buildFromApiToDomain(api);
		expect(result.id).toBe("build-1");
		expect(result.pythonVersion).toBe("3.11.6");
		expect(result.zenmlVersion).toBe("0.66.0");
		expect(result.isLocal).toBe(false);
		expect(result.imagesSet.orchestrator?.image).toBe("orch-img");
		expect(result.imagesSet.perStep.train?.image).toBe("train-img");
		expect(result.imagesSet.perStep.train?.dockerfile).toBe("FROM python\n");
		expect(result.imagesSet.perStepOperator["train.sagemaker"]?.image).toBe(
			"train-sm-img"
		);
	});

	it("returns empty image partitions when metadata.images is missing", () => {
		const api = {
			id: "build-2",
			metadata: { is_local: true },
		} as unknown as PipelineBuildResponse;
		const result = buildFromApiToDomain(api);
		expect(result.imagesSet.orchestrator).toBeUndefined();
		expect(result.imagesSet.perStep).toEqual({});
		expect(result.imagesSet.perStepOperator).toEqual({});
	});

	it("returns empty image partitions when metadata is null", () => {
		const api = {
			id: "build-3",
			metadata: null,
		} as unknown as PipelineBuildResponse;
		const result = buildFromApiToDomain(api);
		expect(result.imagesSet.orchestrator).toBeUndefined();
		expect(result.imagesSet.perStep).toEqual({});
		expect(result.imagesSet.perStepOperator).toEqual({});
		expect(result.pythonVersion).toBeUndefined();
		expect(result.isLocal).toBeUndefined();
	});
});
