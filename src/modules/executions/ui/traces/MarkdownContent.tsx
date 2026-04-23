import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/shared/ui/CodeBlock";
import { cn } from "@/shared/utils/styles";
import { ViewerFrame } from "./ViewerFrame";

type MarkdownContentProps = {
	value: string;
};

type RenderedMarkdownProps = {
	value: string;
	className?: string;
};

const components: Components = {
	h1: ({ children, ...props }) => (
		<h1
			{...props}
			className="text-foreground pt-1 text-sm font-bold first:pt-0"
		>
			{children}
		</h1>
	),
	h2: ({ children, ...props }) => (
		<h2
			{...props}
			className="text-foreground pt-1 text-xs font-bold first:pt-0"
		>
			{children}
		</h2>
	),
	h3: ({ children, ...props }) => (
		<h3
			{...props}
			className="text-foreground pt-1 text-xs font-bold first:pt-0"
		>
			{children}
		</h3>
	),
	h4: ({ children, ...props }) => (
		<h4
			{...props}
			className="text-foreground pt-1 text-xs font-semibold first:pt-0"
		>
			{children}
		</h4>
	),
	p: ({ children, ...props }) => (
		<p {...props} className="text-foreground/80 text-xs leading-relaxed">
			{children}
		</p>
	),
	ul: ({ children, ...props }) => (
		<ul
			{...props}
			className="text-foreground/80 list-disc space-y-1 pl-4 text-xs leading-relaxed"
		>
			{children}
		</ul>
	),
	ol: ({ children, ...props }) => (
		<ol
			{...props}
			className="text-foreground/80 list-decimal space-y-1 pl-4 text-xs leading-relaxed"
		>
			{children}
		</ol>
	),
	strong: ({ children, ...props }) => (
		<strong {...props} className="text-foreground font-semibold">
			{children}
		</strong>
	),
	code: ({ children, className, ...props }) => {
		const match = /language-(\w+)/.exec(className ?? "");
		if (!match) {
			return (
				<code
					{...props}
					className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
				>
					{children}
				</code>
			);
		}
		return (
			<CodeBlock
				code={String(children).replace(/\n$/, "")}
				language={match[1]}
			/>
		);
	},
	pre: ({ children }) => <>{children}</>,
	table: ({ children, ...props }) => (
		<div className="border-border overflow-x-auto rounded-md border">
			<table {...props} className="w-full text-xs">
				{children}
			</table>
		</div>
	),
	thead: ({ children, ...props }) => (
		<thead {...props} className="bg-muted/50 border-border border-b">
			{children}
		</thead>
	),
	tr: ({ children, ...props }) => (
		<tr {...props} className="border-border border-b last:border-0">
			{children}
		</tr>
	),
	th: ({ children, ...props }) => (
		<th
			{...props}
			className="text-foreground px-4 py-1.5 text-left font-semibold"
		>
			{children}
		</th>
	),
	td: ({ children, ...props }) => (
		<td {...props} className="text-foreground/80 px-4 py-1.5">
			{children}
		</td>
	),
	blockquote: ({ children, ...props }) => (
		<blockquote
			{...props}
			className="border-border text-foreground/70 border-l-2 pl-3 text-xs italic"
		>
			{children}
		</blockquote>
	),
	a: ({ children, href, ...props }) => (
		<a
			{...props}
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-primary underline underline-offset-2 hover:no-underline"
		>
			{children}
		</a>
	),
	hr: () => <hr className="border-border" />,
};

export function RenderedMarkdown({ value, className }: RenderedMarkdownProps) {
	return (
		<div className={cn("space-y-3 p-4", className)}>
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{value}
			</ReactMarkdown>
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
		/>
	);
}
