import { describe, expect, it } from "vitest";
import { deriveRegistryUrl } from "./derive-registry-url";

describe("deriveRegistryUrl", () => {
	it("returns null for an unqualified image with no slash", () => {
		expect(deriveRegistryUrl("python")).toBeNull();
		expect(deriveRegistryUrl("python:3.11")).toBeNull();
	});

	it("returns null for Docker Hub library-style images (first segment lacks '.' or ':')", () => {
		expect(deriveRegistryUrl("library/python:3.11")).toBeNull();
		expect(deriveRegistryUrl("zenmldocker/zenml:latest")).toBeNull();
	});

	it("recognises a hostname registry and strips the tag", () => {
		expect(deriveRegistryUrl("gcr.io/my-project/img:tag")).toBe(
			"https://gcr.io/my-project/img"
		);
	});

	it("recognises a port-bearing registry (e.g. localhost:5000)", () => {
		expect(deriveRegistryUrl("localhost:5000/zenml:latest")).toBe(
			"https://localhost:5000/zenml"
		);
		expect(deriveRegistryUrl("localhost:5000/zenml")).toBe(
			"https://localhost:5000/zenml"
		);
	});

	it("strips a digest reference (@sha256:...)", () => {
		expect(deriveRegistryUrl("quay.io/repo/img@sha256:abc123")).toBe(
			"https://quay.io/repo/img"
		);
	});

	it("strips both tag and digest when both are present", () => {
		expect(deriveRegistryUrl("gcr.io/my-project/img:tag@sha256:abc123")).toBe(
			"https://gcr.io/my-project/img"
		);
	});

	it("returns the bare image URL when no tag or digest is present", () => {
		expect(deriveRegistryUrl("gcr.io/my-project/img")).toBe(
			"https://gcr.io/my-project/img"
		);
	});
});
