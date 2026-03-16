function renderJson(val: unknown, indent = 0): React.ReactNode[] {
	const pad = "  ".repeat(indent);
	const elements: React.ReactNode[] = [];

	if (val === null || val === undefined) {
		elements.push(
			<span key="null" className="text-muted-foreground">
				null
			</span>
		);
	} else if (typeof val === "boolean") {
		elements.push(
			<span key="bool" className="text-info">
				{String(val)}
			</span>
		);
	} else if (typeof val === "number") {
		elements.push(
			<span key="num" className="text-primary">
				{String(val)}
			</span>
		);
	} else if (typeof val === "string") {
		elements.push(
			<span key="str" className="text-success">
				&quot;{val}&quot;
			</span>
		);
	} else if (Array.isArray(val)) {
		if (val.length === 0) {
			elements.push(<span key="arr">[]</span>);
		} else {
			elements.push(<span key="open">[{"\n"}</span>);
			val.forEach((item, i) => {
				elements.push(
					<span key={`item-${i}`}>
						{pad} {renderJson(item, indent + 1)}
						{i < val.length - 1 ? "," : ""}
						{"\n"}
					</span>
				);
			});
			elements.push(<span key="close">{pad}]</span>);
		}
	} else if (typeof val === "object") {
		const keys = Object.keys(val as Record<string, unknown>);
		if (keys.length === 0) {
			elements.push(<span key="obj">{"{}"}</span>);
		} else {
			elements.push(
				<span key="open">
					{"{"}
					{"\n"}
				</span>
			);
			keys.forEach((k, i) => {
				elements.push(
					<span key={`key-${k}`}>
						{pad} <span className="text-warning">&quot;{k}&quot;</span>:{" "}
						{renderJson((val as Record<string, unknown>)[k], indent + 1)}
						{i < keys.length - 1 ? "," : ""}
						{"\n"}
					</span>
				);
			});
			elements.push(
				<span key="close">
					{pad}
					{"}"}
				</span>
			);
		}
	}

	return elements;
}

export function JsonViewer({ data }: { data: unknown }) {
	return (
		<pre className="bg-background border-border text-muted-foreground max-h-[300px] overflow-y-auto rounded-md border p-3 font-mono text-xs leading-snug break-all whitespace-pre-wrap">
			{renderJson(data)}
		</pre>
	);
}
