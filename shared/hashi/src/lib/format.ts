export function formatDurationShort(ms: number): string {
	const s = ms / 1000;
	const roundedSeconds = Math.round(s * 10) / 10;
	if (roundedSeconds < 60) return `${roundedSeconds.toFixed(1)}s`;
	const totalSeconds = Math.round(s);
	const totalMinutes = Math.floor(totalSeconds / 60);
	if (totalMinutes < 60) {
		const secs = totalSeconds % 60;
		return secs > 0 ? `${totalMinutes}m ${secs}s` : `${totalMinutes}m`;
	}
	const hours = Math.floor(totalMinutes / 60);
	const mins = totalMinutes % 60;
	return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
