import { useState } from "react";

const DEFAULT_SOURCE = "checkpoint";

export function useCheckpointLogSource(logSources: string[]) {
	const [selectedSource, setSelectedSource] = useState<string>(DEFAULT_SOURCE);
	const effectiveSource = logSources.includes(selectedSource)
		? selectedSource
		: (logSources[0] ?? DEFAULT_SOURCE);

	return { selectedSource: effectiveSource, setSelectedSource };
}
