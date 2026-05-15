import type { components } from "@/shared/api/openapi";

type StackResponse = components["schemas"]["StackResponse"];
type StackResponseMetadata = components["schemas"]["StackResponseMetadata"];
type ComponentResponse = components["schemas"]["ComponentResponse"];
type StackComponentType = components["schemas"]["StackComponentType"];

const DEFAULT_STACK_ID = "55555555-5555-5555-5555-555555555555";

type StackOverrides = Partial<Omit<StackResponse, "metadata">> & {
	metadata?: Partial<StackResponseMetadata>;
};

type ComponentOverrides = Partial<Omit<ComponentResponse, "body">> & {
	body?: Partial<NonNullable<ComponentResponse["body"]>>;
};

export function makeStackComponent(
	type: StackComponentType,
	overrides: ComponentOverrides = {}
): ComponentResponse {
	const { body: bodyOverrides, ...rest } = overrides;
	return {
		id: `cmp-${type}`,
		name: `${type}-component`,
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
			type,
			flavor_name: "local",
			...bodyOverrides,
		},
		...rest,
	};
}

export function makeStack(overrides: StackOverrides = {}): StackResponse {
	const { metadata: metadataOverrides, ...rest } = overrides;
	return {
		id: DEFAULT_STACK_ID,
		name: "default",
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
		},
		metadata: {
			components: {
				orchestrator: [
					makeStackComponent("orchestrator", {
						id: "cmp-orchestrator-1",
						name: "default",
					}),
				],
				artifact_store: [
					makeStackComponent("artifact_store", {
						id: "cmp-artifact-store-1",
						name: "default",
					}),
				],
			},
			...metadataOverrides,
		},
		...rest,
	};
}
