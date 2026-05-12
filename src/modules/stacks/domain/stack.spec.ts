import { describe, expect, it } from "vitest";
import type { components } from "@/shared/api/openapi";
import { stackFromApiToDomain } from "./stack";

type StackResponse = components["schemas"]["StackResponse"];

describe("stackFromApiToDomain", () => {
	it("maps id, name, and components grouped by type", () => {
		const api = {
			id: "stack-1",
			name: "prod-stack",
			body: {
				created: "2026-04-22T10:00:00Z",
				updated: "2026-04-22T10:00:00Z",
				user_id: null,
			},
			metadata: {
				components: {
					orchestrator: [
						{
							id: "c-orch",
							name: "k8s-primary",
							body: {
								type: "orchestrator",
								flavor_name: "kubernetes",
								integration: "kubernetes",
								logo_url: "https://example/k8s.png",
							},
						},
					],
					artifact_store: [
						{
							id: "c-store",
							name: "s3-bucket",
							body: {
								type: "artifact_store",
								flavor_name: "s3",
								integration: "aws",
								logo_url: null,
							},
						},
					],
				},
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any as StackResponse;

		const result = stackFromApiToDomain(api);
		expect(result.id).toBe("stack-1");
		expect(result.name).toBe("prod-stack");
		expect(result.components).toEqual([
			{
				id: "c-orch",
				name: "k8s-primary",
				type: "orchestrator",
				flavorName: "kubernetes",
				integration: "kubernetes",
				logoUrl: "https://example/k8s.png",
			},
			{
				id: "c-store",
				name: "s3-bucket",
				type: "artifact_store",
				flavorName: "s3",
				integration: "aws",
				logoUrl: undefined,
			},
		]);
	});

	it("returns an empty components array when metadata is null", () => {
		const api = {
			id: "stack-2",
			name: "minimal",
			body: {},
			metadata: null,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any as StackResponse;
		expect(stackFromApiToDomain(api).components).toEqual([]);
	});

	it("skips components whose body is missing (permission-denied shells)", () => {
		const api = {
			id: "stack-3",
			name: "partial",
			body: {},
			metadata: {
				components: {
					orchestrator: [
						{
							id: "c-visible",
							name: "visible",
							body: {
								type: "orchestrator",
								flavor_name: "kubernetes",
								integration: "kubernetes",
								logo_url: null,
							},
						},
						{
							id: "c-hidden",
							name: "hidden",
							body: null,
						},
					],
				},
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any as StackResponse;
		expect(stackFromApiToDomain(api).components.map((c) => c.id)).toEqual([
			"c-visible",
		]);
	});
});
