import type { ReactNode } from "react";

import { CodeBlock } from "@/shared/ui/CodeBlock";
import {
	looksMarkdownish,
	normalizeJsonVisualization,
} from "../../domain/content-parser";
import { JsonArtifactViewer } from "./JsonArtifactViewer";
import { RenderedMarkdown } from "./MarkdownContent";
import { ViewerFrame } from "./ViewerFrame";

type JsonContentProps = {
	value: string;
};

type JsonRenderPlan = {
	rendered: ReactNode;
	copyText: string;
	sizeLabel: string;
	decodedFromJson: boolean;
};

type MarkdownEntry = [string, string];

function isMarkdownEntry(entry: [string, unknown]): entry is MarkdownEntry {
	return typeof entry[1] === "string" && looksMarkdownish(entry[1]);
}

function getObjectEntries(value: unknown): [string, unknown][] | null {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return null;
	}
	return Object.entries(value);
}

function stringifyJsonValue(value: unknown): string {
	return JSON.stringify(value, null, 2) ?? String(value);
}

function primitiveCopyText(value: null | boolean | number): string {
	return value === null ? "null" : String(value);
}

function PrimitiveJsonValue({ value }: { value: null | boolean | number }) {
	return (
		<div className="p-4">
			<code className="bg-muted text-foreground rounded px-2 py-1 font-mono text-sm">
				{primitiveCopyText(value)}
			</code>
		</div>
	);
}

function DecodedText({ value }: { value: string }) {
	return (
		<pre className="text-foreground/80 p-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap">
			{value}
		</pre>
	);
}

function PromotedMarkdownObject({
	fieldName,
	markdown,
	metadataEntries,
}: {
	fieldName: string;
	markdown: string;
	metadataEntries: [string, unknown][];
}) {
	const metadata = Object.fromEntries(metadataEntries);

	return (
		<div>
			<div className="border-border border-b px-4 py-2">
				<span className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
					{fieldName}
				</span>
			</div>
			<RenderedMarkdown value={markdown} />
			{metadataEntries.length > 0 && (
				<details className="border-border border-t px-4 py-3">
					<summary className="text-muted-foreground cursor-pointer text-xs font-medium">
						Metadata ({metadataEntries.length} fields)
					</summary>
					<div className="border-border bg-muted/20 mt-3 overflow-hidden rounded-md border">
						<JsonArtifactViewer data={metadata} />
					</div>
				</details>
			)}
		</div>
	);
}

function planParsedJson(
	value: unknown,
	wasStringEnvelope: boolean
): JsonRenderPlan {
	const objectEntries = getObjectEntries(value);
	if (objectEntries) {
		const markdownEntries = objectEntries.filter(isMarkdownEntry);
		if (markdownEntries.length === 1) {
			const [fieldName, markdown] = markdownEntries[0];
			const metadataEntries = objectEntries.filter(
				([key]) => key !== fieldName
			);
			return {
				rendered: (
					<PromotedMarkdownObject
						fieldName={fieldName}
						markdown={markdown}
						metadataEntries={metadataEntries}
					/>
				),
				copyText: markdown,
				sizeLabel: `${markdown.length} chars decoded`,
				decodedFromJson: wasStringEnvelope,
			};
		}
	}

	if (typeof value === "string") {
		return {
			rendered: looksMarkdownish(value) ? (
				<RenderedMarkdown value={value} />
			) : (
				<DecodedText value={value} />
			),
			copyText: value,
			sizeLabel: `${value.length} chars decoded`,
			decodedFromJson: wasStringEnvelope,
		};
	}

	if (
		value === null ||
		typeof value === "boolean" ||
		typeof value === "number"
	) {
		const copyText = primitiveCopyText(value);
		return {
			rendered: <PrimitiveJsonValue value={value} />,
			copyText,
			sizeLabel: `${copyText.length} chars decoded`,
			decodedFromJson: wasStringEnvelope,
		};
	}

	const copyText = stringifyJsonValue(value);
	return {
		rendered: <JsonArtifactViewer data={value} />,
		copyText,
		sizeLabel: `${copyText.length} chars decoded`,
		decodedFromJson: wasStringEnvelope,
	};
}

export function JsonContent({ value }: JsonContentProps) {
	const normalized = normalizeJsonVisualization(value);
	const plan: JsonRenderPlan =
		normalized.kind === "unparseable"
			? {
					rendered: <CodeBlock code={normalized.raw} language="json" wrap />,
					copyText: normalized.raw,
					sizeLabel: `${normalized.raw.length} chars`,
					decodedFromJson: false,
				}
			: planParsedJson(normalized.value, normalized.wasStringEnvelope);

	return (
		<ViewerFrame
			type="json"
			rendered={plan.rendered}
			rawText={value}
			copyText={plan.copyText}
			sizeLabel={plan.sizeLabel}
			decodedFromJson={plan.decodedFromJson}
			rawLanguage="json"
			collapseLong={false}
		/>
	);
}
