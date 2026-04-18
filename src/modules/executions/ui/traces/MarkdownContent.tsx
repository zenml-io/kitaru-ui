import { CodeBlock } from "@/shared/ui/CodeBlock";
import { cn } from "@/shared/utils/styles";
import { parseContentBlocks } from "../../domain/content-parser";
import { ViewerFrame } from "./ViewerFrame";

type MarkdownContentProps = {
	value: string;
};

type RenderedMarkdownProps = {
	value: string;
	className?: string;
};

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
							className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
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

export function RenderedMarkdown({ value, className }: RenderedMarkdownProps) {
	const blocks = parseContentBlocks(value);

	return (
		<div className={cn("space-y-3 p-4", className)}>
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
										<span className="text-muted-foreground font-mono text-xs">
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
								<table className="w-full text-xs">
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
							<p key={i} className="text-foreground/80 text-xs leading-relaxed">
								<InlineMarkdown text={block.text} />
							</p>
						);
				}
			})}
		</div>
	);
}

export function MarkdownContent({ value }: MarkdownContentProps) {
	return (
		<ViewerFrame
			type="markdown"
			rendered={<RenderedMarkdown value={value} />}
			rawText={value}
			copyText={value}
			sizeLabel={`${value.length} chars`}
			rawLanguage="markdown"
			density="compact"
			collapseLong
		/>
	);
}
