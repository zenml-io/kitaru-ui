/**
 * Formats an execution index as a 4-digit zero-padded string.
 * e.g., 1 => "0001", 42 => "0042", 1234 => "1234"
 */
export function formatExecutionIndex(index: number): string {
	return String(index).padStart(4, "0");
}

/**
 * Formats an execution name with an optional index prefix.
 * e.g., formatExecutionName("my-run", 1) => "#0001-my-run"
 * e.g., formatExecutionName("my-run") => "my-run"
 */
export function formatExecutionName(name: string, index?: number): string {
	if (index === undefined) return name;
	return `#${formatExecutionIndex(index)}-${name}`;
}
