export type ContentBlock =
	| { type: "text"; text: string }
	| { type: "heading"; text: string; level: number }
	| { type: "code"; text: string; lang?: string }
	| { type: "list"; items: string[] }
	| { type: "table"; headers: string[]; rows: string[][] };

export function parseContentBlocks(content: string): ContentBlock[] {
	const blocks: ContentBlock[] = [];
	const lines = content.split("\n");
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		if (line.startsWith("```")) {
			const lang = line.slice(3).trim() || undefined;
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i].startsWith("```")) {
				codeLines.push(lines[i]);
				i++;
			}
			if (i < lines.length) i++;
			blocks.push({ type: "code", text: codeLines.join("\n"), lang });
			continue;
		}

		if (line.match(/^#{1,6}\s/)) {
			const level = line.match(/^(#+)/)![1].length;
			blocks.push({
				type: "heading",
				text: line.replace(/^#+\s*/, ""),
				level,
			});
			i++;
			continue;
		}

		if (line.startsWith("|") && line.includes("|", 1)) {
			const tableLines: string[] = [line];
			i++;
			while (i < lines.length && lines[i].startsWith("|")) {
				tableLines.push(lines[i]);
				i++;
			}
			const parsed = parseTable(tableLines);
			if (parsed) {
				blocks.push(parsed);
			} else {
				blocks.push({ type: "text", text: tableLines.join("\n") });
			}
			continue;
		}

		if (line.match(/^[\s]*[-*]\s/) || line.match(/^[\s]*\d+\.\s/)) {
			const items: string[] = [];
			while (
				i < lines.length &&
				(lines[i].match(/^[\s]*[-*]\s/) || lines[i].match(/^[\s]*\d+\.\s/))
			) {
				items.push(
					lines[i].replace(/^[\s]*[-*]\s+/, "").replace(/^[\s]*\d+\.\s+/, "")
				);
				i++;
			}
			blocks.push({ type: "list", items });
			continue;
		}

		if (!line.trim()) {
			i++;
			continue;
		}

		const textLines: string[] = [line];
		i++;
		while (
			i < lines.length &&
			lines[i].trim() &&
			!lines[i].startsWith("#") &&
			!lines[i].startsWith("```") &&
			!lines[i].startsWith("|") &&
			!lines[i].match(/^[\s]*[-*]\s/) &&
			!lines[i].match(/^[\s]*\d+\.\s/)
		) {
			textLines.push(lines[i]);
			i++;
		}
		blocks.push({ type: "text", text: textLines.join("\n") });
	}

	return blocks;
}

function parseTable(lines: string[]): ContentBlock | null {
	if (lines.length < 2) return null;

	const parseLine = (l: string) =>
		l
			.split("|")
			.map((c) => c.trim())
			.filter(Boolean);

	const headers = parseLine(lines[0]);
	const startRow = lines[1].match(/^[\s|:-]+$/) ? 2 : 1;

	const rows: string[][] = [];
	for (let j = startRow; j < lines.length; j++) {
		rows.push(parseLine(lines[j]));
	}

	return { type: "table", headers, rows };
}

export type NormalizedJson =
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
			// Fall through to the first parsed string. The compatibility parse is
			// intentionally bounded to one object/array-looking inner value.
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

export function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let field = "";
	let row: string[] = [];
	let inQuotes = false;
	let hasPendingField = false;

	for (let i = 0; i < text.length; i++) {
		const character = text[i];

		if (inQuotes) {
			if (character === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += character;
			}
			continue;
		}

		if (character === '"') {
			inQuotes = true;
			hasPendingField = true;
		} else if (character === ",") {
			row.push(field);
			field = "";
			hasPendingField = true;
		} else if (character === "\n") {
			row.push(field);
			rows.push(row);
			row = [];
			field = "";
			hasPendingField = false;
		} else if (character !== "\r") {
			field += character;
			hasPendingField = true;
		}
	}

	if (field.length > 0 || row.length > 0 || hasPendingField) {
		row.push(field);
		rows.push(row);
	}

	return rows;
}

export function tryParseJson(text: string): unknown | null {
	const trimmed = text.trim();
	if (looksLikeObjectOrArray(trimmed)) {
		try {
			return JSON.parse(trimmed);
		} catch {
			return null;
		}
	}
	return null;
}
