export type SseFrame = {
	id?: string;
	event?: string;
	data: string;
};

export type SseParserState = {
	buffer: string;
};

export function createInitialSseParserState(): SseParserState {
	return { buffer: "" };
}

export function parseSseChunk(
	state: SseParserState,
	chunk: string
): { state: SseParserState; frames: SseFrame[] } {
	const normalized = (state.buffer + chunk).replaceAll("\r\n", "\n");
	const parts = normalized.split("\n\n");
	const completeParts = parts.slice(0, -1);
	const buffer = parts.at(-1) ?? "";
	const frames = completeParts.flatMap(parseSseFrameText);

	return { state: { buffer }, frames };
}

export function flushSseParser(state: SseParserState): {
	state: SseParserState;
	frames: SseFrame[];
} {
	if (!state.buffer.trim()) {
		return { state: createInitialSseParserState(), frames: [] };
	}
	return {
		state: createInitialSseParserState(),
		frames: parseSseFrameText(state.buffer),
	};
}

function parseSseFrameText(frameText: string): SseFrame[] {
	let id: string | undefined;
	let event: string | undefined;
	const dataLines: string[] = [];
	let sawUsefulLine = false;

	for (const line of frameText.split("\n")) {
		if (!line || line.startsWith(":")) {
			continue;
		}

		sawUsefulLine = true;
		const separatorIndex = line.indexOf(":");
		const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
		const rawValue =
			separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);
		const value = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;

		if (field === "id") {
			id = value || undefined;
		} else if (field === "event") {
			event = value || undefined;
		} else if (field === "data") {
			dataLines.push(value);
		}
	}

	if (!sawUsefulLine) {
		return [];
	}

	return [{ id, event, data: dataLines.join("\n") }];
}
