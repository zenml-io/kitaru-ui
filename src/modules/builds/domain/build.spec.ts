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
	it("maps id, version metadata, and the images map keyed by checkpoint name and 'orchestrator'", () => {
		const api = {
			id: "build-1",
			metadata: {
				python_version: "3.11.6",
				zenml_version: "0.66.0",
				is_local: false,
				contains_code: true,
				images: {
					orchestrator: { image: "orch-img" },
					train: { image: "train-img", dockerfile: "FROM python\n" },
				},
			},
		} as unknown as PipelineBuildResponse;

		const result = buildFromApiToDomain(api);
		expect(result.id).toBe("build-1");
		expect(result.pythonVersion).toBe("3.11.6");
		expect(result.zenmlVersion).toBe("0.66.0");
		expect(result.isLocal).toBe(false);
		expect(result.containsCode).toBe(true);
		expect(Object.keys(result.images).sort()).toEqual([
			"orchestrator",
			"train",
		]);
		expect(result.images.orchestrator.image).toBe("orch-img");
		expect(result.images.train.dockerfile).toBe("FROM python\n");
	});

	it("returns an empty images map when metadata.images is missing", () => {
		const api = {
			id: "build-2",
			metadata: { is_local: true, contains_code: false },
		} as unknown as PipelineBuildResponse;
		expect(buildFromApiToDomain(api).images).toEqual({});
	});

	it("returns an empty images map when metadata is null", () => {
		const api = {
			id: "build-3",
			metadata: null,
		} as unknown as PipelineBuildResponse;
		const result = buildFromApiToDomain(api);
		expect(result.images).toEqual({});
		expect(result.pythonVersion).toBeUndefined();
		expect(result.isLocal).toBeUndefined();
	});
});
