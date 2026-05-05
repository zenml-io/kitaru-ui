import { describe, expect, it } from "vitest";
import type { StackComponent } from "@/modules/stacks/domain/stack";
import { groupStackComponents } from "./group-stack-components";

const c = (
	id: string,
	type: StackComponent["type"],
	name: string
): StackComponent => ({
	id,
	name,
	type,
	flavorName: "x",
});

describe("groupStackComponents", () => {
	it("uses 'group' variant when a type has multiple components", () => {
		const result = groupStackComponents([
			c("a", "alerter", "slack-1"),
			c("b", "alerter", "slack-2"),
			c("c", "orchestrator", "k8s"),
		]);
		expect(result).toEqual([
			{
				variant: "group",
				type: "alerter",
				components: [
					expect.objectContaining({ id: "a" }),
					expect.objectContaining({ id: "b" }),
				],
			},
			{
				variant: "single",
				type: "orchestrator",
				component: expect.objectContaining({ id: "c" }),
			},
		]);
	});

	it("preserves the order of first appearance", () => {
		const result = groupStackComponents([
			c("c", "orchestrator", "k8s"),
			c("a", "alerter", "slack-1"),
			c("b", "alerter", "slack-2"),
		]);
		const types = result.map((r) => r.type);
		expect(types).toEqual(["orchestrator", "alerter"]);
	});

	it("returns an empty array when given no components", () => {
		expect(groupStackComponents([])).toEqual([]);
	});
});
