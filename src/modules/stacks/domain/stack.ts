import type { components } from "@/shared/api/openapi";

export type StackComponentType = components["schemas"]["StackComponentType"];

export type StackComponent = {
	id: string;
	name: string;
	type: StackComponentType;
	flavorName: string;
	integration?: string;
	logoUrl?: string;
};

export type Stack = {
	id: string;
	name: string;
	components: StackComponent[];
};

export function stackFromApiToDomain(
	stack: components["schemas"]["StackResponse"]
): Stack {
	const componentsMap = stack.metadata?.components ?? {};
	const stackComponents: StackComponent[] = [];
	for (const list of Object.values(componentsMap)) {
		for (const c of list) {
			if (!c.body) continue;
			stackComponents.push({
				id: c.id,
				name: c.name,
				type: c.body.type,
				flavorName: c.body.flavor_name,
				integration: c.body.integration ?? undefined,
				logoUrl: c.body.logo_url ?? undefined,
			});
		}
	}
	return {
		id: stack.id,
		name: stack.name,
		components: stackComponents,
	};
}
