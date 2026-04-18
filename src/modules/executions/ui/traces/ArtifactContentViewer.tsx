import type { ArtifactVisualization } from "@/modules/checkpoints/domain/visualization";
import { CsvContent } from "./CsvContent";
import { HtmlContent } from "./HtmlContent";
import { ImageContent } from "./ImageContent";
import { JsonContent } from "./JsonContent";
import { MarkdownContent } from "./MarkdownContent";
import { ViewerFrame } from "./ViewerFrame";

type ArtifactContentViewerProps = {
	artifact: ArtifactVisualization;
};

export function ArtifactContentViewer({
	artifact,
}: ArtifactContentViewerProps) {
	switch (artifact.type) {
		case "markdown":
			return <MarkdownContent value={artifact.value} />;
		case "json":
			return <JsonContent value={artifact.value} />;
		case "html":
			return <HtmlContent value={artifact.value} />;
		case "csv":
			return <CsvContent value={artifact.value} />;
		case "image":
			return <ImageContent value={artifact.value} />;
		default:
			return (
				<ViewerFrame
					type={String(artifact.type)}
					rendered={
						<pre className="text-foreground/80 p-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap">
							{artifact.value}
						</pre>
					}
					rawText={artifact.value}
					copyText={artifact.value}
					sizeLabel={`${artifact.value.length} chars`}
					rawLanguage="text"
				/>
			);
	}
}
