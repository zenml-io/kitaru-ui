import { CodeBlock } from "@/shared/ui/CodeBlock";
import { JsonArtifactViewer } from "./JsonArtifactViewer";
import { parseContentBlocks, tryParseJson } from "../../domain/content-parser";
import { cn } from "@/shared/utils/styles";
import type { ArtifactVisualization } from "@/modules/checkpoints/domain/visualization";

function InlineMarkdown({ text }: { text: string }) {
	const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
	return (
		<>
			{parts.map((part, i) => {
				if (part.startsWith("**") && part.endsWith("**")) {
					return (
						<strong key={i} className="text-foreground font-semibold">
							{part.slice(2, -2)}
						</strong>
					);
				}
				if (part.startsWith("`") && part.endsWith("`")) {
					return (
						<code
							key={i}
							className="bg-muted text-2xs text-foreground rounded px-1 py-0.5 font-mono"
						>
							{part.slice(1, -1)}
						</code>
					);
				}
				return <span key={i}>{part}</span>;
			})}
		</>
	);
}

interface VisualizationViewerProps {
	artifact: ArtifactVisualization;
}

export function VisualizationViewer({ artifact }: VisualizationViewerProps) {
	switch (artifact.type) {
		case "json": {
			const parsed = tryParseJson(artifact.value);
			if (parsed !== null) {
				return <JsonArtifactViewer data={parsed} />;
			}
			return (
				<div>
					<CodeBlock code={artifact.value} language="json" wrap />
				</div>
			);
		}

		case "markdown": {
			const blocks = parseContentBlocks(artifact.value);
			return (
				<div className="space-y-3 p-4">
					{blocks.map((block, i) => {
						switch (block.type) {
							case "heading":
								return (
									<h3
										key={i}
										className={cn(
											"text-foreground pt-1 font-bold first:pt-0",
											block.level === 1 ? "text-sm" : "text-xs"
										)}
									>
										<InlineMarkdown text={block.text} />
									</h3>
								);
							case "code":
								return (
									<div
										key={i}
										className="border-border bg-muted/30 overflow-hidden rounded-md border"
									>
										{block.lang && (
											<div className="border-border bg-muted/50 border-b px-4 py-1.5">
												<span className="text-2xs text-muted-foreground font-mono">
													{block.lang}
												</span>
											</div>
										)}
										<CodeBlock code={block.text} language={block.lang} />
									</div>
								);
							case "list":
								return (
									<ul
										key={i}
										className="text-foreground/80 space-y-1 pl-4 text-xs leading-relaxed"
									>
										{block.items.map((item, j) => (
											<li key={j} className="list-disc">
												<InlineMarkdown text={item} />
											</li>
										))}
									</ul>
								);
							case "table":
								return (
									<div
										key={i}
										className="border-border overflow-x-auto rounded-md border"
									>
										<table className="text-2xs w-full">
											<thead>
												<tr className="bg-muted/50 border-border border-b">
													{block.headers.map((h, j) => (
														<th
															key={j}
															className="text-foreground px-4 py-1.5 text-left font-semibold"
														>
															<InlineMarkdown text={h} />
														</th>
													))}
												</tr>
											</thead>
											<tbody>
												{block.rows.map((row, j) => (
													<tr
														key={j}
														className="border-border border-b last:border-0"
													>
														{row.map((cell, k) => (
															<td
																key={k}
																className="text-foreground/80 px-4 py-1.5"
															>
																<InlineMarkdown text={cell} />
															</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								);
							case "text":
							default:
								return (
									<p
										key={i}
										className="text-foreground/80 text-xs leading-relaxed"
									>
										<InlineMarkdown text={block.text} />
									</p>
								);
						}
					})}
				</div>
			);
		}

		case "html":
			return (
				<div className="h-full">
					<iframe
						srcDoc={artifact.value}
						className="h-full min-h-64 w-full border-0 bg-white"
						title="visualization"
					/>
				</div>
			);

		case "image":
			return (
				<div className="p-4">
					<img
						src={artifact.value}
						alt="visualization"
						className="max-w-full rounded-md"
					/>
				</div>
			);

		case "csv":
			return <CsvViewer content={artifact.value} />;
	}
}

function CsvViewer({ content }: { content: string }) {
	const rows = content
		.trim()
		.split("\n")
		.map((row) => row.split(","));
	const [header, ...body] = rows;

	return (
		<div className="overflow-auto">
			<table className="w-full border-collapse text-xs">
				<thead>
					<tr>
						{header.map((cell, i) => (
							<th
								key={i}
								className="text-muted-foreground border-border border-b px-2 py-1 text-left font-semibold"
							>
								{cell}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{body.map((row, i) => (
						<tr key={i}>
							{row.map((cell, j) => (
								<td
									key={j}
									className="border-border border-b px-2 py-1 font-mono"
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
