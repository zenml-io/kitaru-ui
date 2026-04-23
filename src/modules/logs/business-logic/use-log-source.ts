import { useState } from "react";

export function useLogSource(logSources: string[], defaultSource: string) {
	const [selectedSource, setSelectedSource] = useState<string>(defaultSource);
	const effectiveSource = logSources.includes(selectedSource)
		? selectedSource
		: (logSources[0] ?? defaultSource);

	return { selectedSource: effectiveSource, setSelectedSource };
}
