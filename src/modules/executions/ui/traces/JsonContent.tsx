import type { ReactNode } from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import { CodeBlock } from "@/shared/ui/CodeBlock";
import {
	looksMarkdownish,
	normalizeJsonVisualization,
	selectPromotedMarkdownField,
} from "../../domain/content-parser";
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

const jsonViewStyles = {
	...defaultStyles,
	container: "font-mono text-xs leading-relaxed",
	basicChildStyle: "my-0",
	label: "text-foreground mr-1",
	clickableLabel: "text-foreground mr-1 cursor-pointer",
	nullValue: "text-muted-foreground italic",
	undefinedValue: "text-muted-foreground italic",
	numberValue: "text-primary",
	stringValue: "text-success whitespace-pre-wrap",
	booleanValue: "text-primary",
	otherValue: "text-foreground",
	punctuation: `${defaultStyles.punctuation} !text-muted-foreground`,
	expandIcon: `${defaultStyles.expandIcon} !text-muted-foreground`,
	collapseIcon: `${defaultStyles.collapseIcon} !text-muted-foreground`,
	childFieldsContainer: "border-l border-border ml-2 pl-2",
	quotesForFieldNames: true,
};

function JsonTree({ data }: { data: object }) {
	return (
		<div className="overflow-x-auto p-4">
			<JsonView
				data={data}
				shouldExpandNode={allExpanded}
				clickToExpandNode
				style={jsonViewStyles}
			/>
		</div>
	);
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
						Metadata ({metadataEntries.length}{" "}
						{metadataEntries.length === 1 ? "field" : "fields"})
					</summary>
					<div className="border-border bg-muted/20 mt-3 overflow-hidden rounded-md border">
						<JsonTree data={metadata} />
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
	const promoted = selectPromotedMarkdownField(value);
	if (promoted) {
		return {
			rendered: (
				<PromotedMarkdownObject
					fieldName={promoted.fieldName}
					markdown={promoted.markdown}
					metadataEntries={promoted.metadataEntries}
				/>
			),
			copyText: promoted.markdown,
			sizeLabel: `${promoted.markdown.length} chars decoded`,
			decodedFromJson: wasStringEnvelope,
		};
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
		rendered: <JsonTree data={value as object} />,
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
		/>
	);
}
