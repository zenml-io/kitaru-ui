import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { JsonViewer } from "./JsonViewer";

interface ArtifactVisualizationProps {
	artifactVersionId: string;
}

export function ArtifactVisualization({
	artifactVersionId,
}: ArtifactVisualizationProps) {
	const { visualizationData } = useArtifactVisualization(artifactVersionId);

	if (!visualizationData) return null;

	const { type, value } = visualizationData;

	if (type === "json") {
		return <JsonViewer data={JSON.parse(value)} />;
	}

	if (type === "markdown") {
		return (
			<pre className="text-foreground max-h-[300px] overflow-auto font-sans text-xs break-words whitespace-pre-wrap">
				{value}
			</pre>
		);
	}

	if (type === "html") {
		return (
			<iframe
				srcDoc={value}
				sandbox=""
				className="h-64 w-full rounded border-0"
				title="visualization"
			/>
		);
	}

	if (type === "image") {
		return (
			<img
				src={value}
				alt="visualization"
				className="max-h-64 w-full rounded object-contain"
			/>
		);
	}

	if (type === "csv") {
		return <CsvViewer value={value} />;
	}

	return null;
}

function CsvViewer({ value }: { value: string }) {
	const rows = value
		.trim()
		.split("\n")
		.map((row) => row.split(","));
	const [header, ...body] = rows;

	return (
		<div className="max-h-[300px] overflow-auto">
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
