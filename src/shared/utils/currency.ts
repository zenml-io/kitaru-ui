export function formatCost(cost: number): string {
	if (cost < 0.001) return `$${(cost * 1000).toFixed(3)}m`;
	return `$${cost.toFixed(4)}`;
}
