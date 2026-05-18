import type {
	StackComponent,
	StackComponentType,
} from "@/modules/stacks/domain/stack";

export type GroupedStackComponents =
	| { variant: "single"; type: StackComponentType; component: StackComponent }
	| {
			variant: "group";
			type: StackComponentType;
			components: StackComponent[];
	  };

export function groupStackComponents(
	components: StackComponent[]
): GroupedStackComponents[] {
	const byType = new Map<StackComponentType, StackComponent[]>();
	const order: StackComponentType[] = [];
	for (const component of components) {
		if (!byType.has(component.type)) {
			byType.set(component.type, []);
			order.push(component.type);
		}
		byType.get(component.type)!.push(component);
	}
	return order.map((type) => {
		const list = byType.get(type)!;
		if (list.length > 1) {
			return { variant: "group", type, components: list };
		}
		return { variant: "single", type, component: list[0] };
	});
}
