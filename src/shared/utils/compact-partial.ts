export function compactPartial<T extends object>(
	partial: Partial<T>
): Partial<T> {
	const result: Partial<T> = {};
	for (const key in partial) {
		const value = partial[key];
		if (value !== undefined) {
			result[key] = value;
		}
	}
	return result;
}
