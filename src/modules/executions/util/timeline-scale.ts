export const POWER_SCALE_EXPONENT = 0.5;

export function computeTimelineWidths(durations: number[]): number[] {
	if (durations.length === 0) return [];
	if (durations.length === 1) return [100];

	const scaled = durations.map((d) =>
		d > 0 ? Math.pow(d, POWER_SCALE_EXPONENT) : 0
	);
	const total = scaled.reduce((sum, v) => sum + v, 0);
	if (total === 0) return durations.map(() => 100 / durations.length);

	return scaled.map((v) => (v / total) * 100);
}
