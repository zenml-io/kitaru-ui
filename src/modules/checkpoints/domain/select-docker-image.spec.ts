import { describe, expect, it } from "vitest";
import type {
	BuildImagesSet,
	DockerImage,
} from "@/modules/builds/domain/build";
import { selectDockerImage } from "./select-docker-image";

const stub = (name: string): DockerImage => ({ image: `${name}-image` });

describe("selectDockerImage", () => {
	const images: BuildImagesSet = {
		orchestrator: stub("orchestrator"),
		perStep: { train: stub("train") },
		perStepOperator: { "train.sagemaker": stub("train.sagemaker") },
	};

	it("prefers <checkpointName>.<stepOperator> when both are present", () => {
		expect(selectDockerImage(images, "train", "sagemaker")?.image).toBe(
			"train.sagemaker-image"
		);
	});

	it("falls back to <checkpointName> when the operator-prefixed key is missing", () => {
		expect(selectDockerImage(images, "train", "vertex")?.image).toBe(
			"train-image"
		);
	});

	it("falls back to 'orchestrator' when neither operator-prefixed nor checkpoint-name keys exist", () => {
		expect(selectDockerImage(images, "evaluate", "vertex")?.image).toBe(
			"orchestrator-image"
		);
	});

	it("skips the operator-prefixed lookup when stepOperator is undefined", () => {
		expect(selectDockerImage(images, "train")?.image).toBe("train-image");
	});

	it("skips the operator-prefixed lookup when stepOperator is empty", () => {
		expect(selectDockerImage(images, "train", "")?.image).toBe("train-image");
	});

	it("returns null when no key matches", () => {
		const empty: BuildImagesSet = { perStep: {}, perStepOperator: {} };
		expect(selectDockerImage(empty, "train", "sagemaker")).toBeNull();
	});
});
