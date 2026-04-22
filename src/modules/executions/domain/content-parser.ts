type NormalizedJson =
	| { kind: "value"; value: unknown; wasStringEnvelope: boolean }
	| { kind: "unparseable"; raw: string };

function looksLikeObjectOrArray(text: string): boolean {
	const trimmed = text.trim();
	return (
		(trimmed.startsWith("{") && trimmed.endsWith("}")) ||
		(trimmed.startsWith("[") && trimmed.endsWith("]"))
	);
}

export function normalizeJsonVisualization(raw: string): NormalizedJson {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return { kind: "unparseable", raw };
	}

	if (typeof parsed === "string" && looksLikeObjectOrArray(parsed)) {
		try {
			return {
				kind: "value",
				value: JSON.parse(parsed),
				wasStringEnvelope: true,
			};
		} catch {
			// Cap the envelope unwrap at one level; keep the first successful parse.
		}
	}

	return {
		kind: "value",
		value: parsed,
		wasStringEnvelope: typeof parsed === "string",
	};
}

const MARKDOWN_HINTS = [
	/^#{1,6}\s+\S/m,
	/^\s{0,3}[-*+]\s+\S/m,
	/^\s{0,3}\d+\.\s+\S/m,
	/```/,
	/^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/m,
	/\*\*[^*\n]+\*\*/,
	/^\s*\|.+\|\s*$/m,
];

export function looksMarkdownish(text: string): boolean {
	return MARKDOWN_HINTS.some((pattern) => pattern.test(text));
}

type PromotedMarkdownField = {
	fieldName: string;
	markdown: string;
	metadataEntries: [string, unknown][];
};

export function selectPromotedMarkdownField(
	value: unknown
): PromotedMarkdownField | null {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return null;
	}
	const entries = Object.entries(value);
	const markdownEntries = entries.filter(
		(entry): entry is [string, string] =>
			typeof entry[1] === "string" && looksMarkdownish(entry[1])
	);
	if (markdownEntries.length !== 1) {
		return null;
	}
	const [fieldName, markdown] = markdownEntries[0];
	return {
		fieldName,
		markdown,
		metadataEntries: entries.filter(([key]) => key !== fieldName),
	};
}
