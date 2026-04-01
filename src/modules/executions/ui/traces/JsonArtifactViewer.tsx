import { CodeBlock } from "@/shared/ui/CodeBlock";

interface JsonArtifactViewerProps {
	data: unknown;
}

function isEmbeddedCode(val: string): boolean {
	return val.includes("\n") && val.length > 200;
}

function guessLanguage(val: string): string {
	if (val.includes("def ") || val.includes("import ") || val.includes("print("))
		return "python";
	if (val.includes("function ") || val.includes("const ")) return "javascript";
	if (val.includes("<html") || val.includes("<!DOCTYPE")) return "html";
	return "text";
}

function JsonValue({ value, depth }: { value: unknown; depth: number }) {
	if (value === null)
		return <span className="text-[var(--code-constant)]">null</span>;
	if (typeof value === "boolean")
		return <span className="text-[var(--code-constant)]">{String(value)}</span>;
	if (typeof value === "number")
		return <span className="text-[var(--code-constant)]">{String(value)}</span>;

	if (typeof value === "string") {
		return (
			<span className="text-[var(--code-string)]">&quot;{value}&quot;</span>
		);
	}

	if (Array.isArray(value)) {
		if (value.length === 0)
			return <span className="text-[var(--code-muted)]">[]</span>;
		return <JsonArray items={value} depth={depth} />;
	}

	if (typeof value === "object") {
		const keys = Object.keys(value as Record<string, unknown>);
		if (keys.length === 0)
			return <span className="text-[var(--code-muted)]">{"{}"}</span>;
		return <JsonObject data={value as Record<string, unknown>} depth={depth} />;
	}

	return <span>{String(value)}</span>;
}

function JsonObject({
	data,
	depth,
}: {
	data: Record<string, unknown>;
	depth: number;
}) {
	const indent = "  ".repeat(depth);
	const innerIndent = "  ".repeat(depth + 1);
	const keys = Object.keys(data);

	return (
		<>
			<span className="text-[var(--code-muted)]">{"{"}</span>
			{"\n"}
			{keys.map((key, i) => {
				const val = data[key];
				return (
					<span key={key}>
						{innerIndent}
						<span className="text-[var(--code-keyword)]">
							&quot;{key}&quot;
						</span>
						<span className="text-[var(--code-muted)]">: </span>
						<JsonValue value={val} depth={depth + 1} />
						{i < keys.length - 1 && (
							<span className="text-[var(--code-muted)]">,</span>
						)}
						{"\n"}
					</span>
				);
			})}
			{indent}
			<span className="text-[var(--code-muted)]">{"}"}</span>
		</>
	);
}

function JsonArray({ items, depth }: { items: unknown[]; depth: number }) {
	const indent = "  ".repeat(depth);
	const innerIndent = "  ".repeat(depth + 1);

	return (
		<>
			<span className="text-[var(--code-muted)]">[</span>
			{"\n"}
			{items.map((item, i) => (
				<span key={i}>
					{innerIndent}
					<JsonValue value={item} depth={depth + 1} />
					{i < items.length - 1 && (
						<span className="text-[var(--code-muted)]">,</span>
					)}
					{"\n"}
				</span>
			))}
			{indent}
			<span className="text-[var(--code-muted)]">]</span>
		</>
	);
}

export function JsonArtifactViewer({ data }: JsonArtifactViewerProps) {
	if (typeof data === "object" && data !== null && !Array.isArray(data)) {
		const keys = Object.keys(data);
		if (keys.length === 1) {
			const val = (data as Record<string, unknown>)[keys[0]];
			if (typeof val === "string" && isEmbeddedCode(val)) {
				const lang = guessLanguage(val);
				return (
					<div>
						<CodeBlock code={val} language={lang} />
					</div>
				);
			}
		}
	}

	return (
		<pre className="text-2xs p-4 font-mono leading-relaxed break-words whitespace-pre-wrap">
			<JsonValue value={data} depth={0} />
		</pre>
	);
}
