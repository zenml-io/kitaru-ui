import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";

// A node is included when it matches the (label) search; its children are
// recursed only when the node is `expanded`.
export function flattenNodes(
	nodes: TimelineNode[],
	searchFilter = "",
	depth = 0
): { node: TimelineNode; depth: number }[] {
	const result: { node: TimelineNode; depth: number }[] = [];
	const q = searchFilter.toLowerCase();
	for (const node of nodes) {
		const matches = !q || node.label.toLowerCase().includes(q);
		if (matches) result.push({ node, depth });
		if (node.expanded && node.children.length > 0) {
			result.push(...flattenNodes(node.children, searchFilter, depth + 1));
		}
	}
	return result;
}

// Max end across the whole tree (ignores expand/search), used as the time extent.
export function timelineExtentMs(nodes: TimelineNode[]): number {
	let max = 0;
	const walk = (list: TimelineNode[]) => {
		for (const n of list) {
			max = Math.max(max, n.startMs + n.durationMs);
			if (n.children.length > 0) walk(n.children);
		}
	};
	walk(nodes);
	return max;
}
