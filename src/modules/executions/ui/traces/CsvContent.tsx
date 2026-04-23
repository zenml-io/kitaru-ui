import Papa from "papaparse";

import { CodeBlock } from "@/shared/ui/CodeBlock";
import { ViewerFrame } from "./ViewerFrame";

type CsvContentProps = {
	value: string;
};

function CsvTable({ rows }: { rows: string[][] }) {
	const [header, ...body] = rows;

	return (
		<div className="overflow-auto p-4">
			<table className="border-border w-full border-collapse overflow-hidden rounded-md border text-xs">
				<thead>
					<tr className="bg-muted/50 border-border border-b">
						{header.map((cell, i) => (
							<th
								key={i}
								className="text-muted-foreground sticky top-0 px-3 py-2 text-left font-semibold whitespace-pre-wrap"
							>
								{cell}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{body.map((row, i) => (
						<tr
							key={i}
							className="border-border odd:bg-background even:bg-muted/20 border-b last:border-0"
						>
							{row.map((cell, j) => (
								<td
									key={j}
									className="text-foreground/80 px-3 py-2 align-top font-mono whitespace-pre-wrap"
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

export function CsvContent({ value }: CsvContentProps) {
	const rows = Papa.parse<string[]>(value, { skipEmptyLines: true }).data;
	const header = rows[0];
	const sizeLabel = header
		? `${Math.max(rows.length - 1, 0)} rows × ${header.length} cols`
		: `${value.length} chars`;

	return (
		<ViewerFrame
			type="csv"
			rendered={
				rows.length > 0 ? (
					<CsvTable rows={rows} />
				) : (
					<CodeBlock code={value} language="csv" wrap />
				)
			}
			rawText={value}
			copyText={value}
			sizeLabel={sizeLabel}
			rawLanguage="csv"
			density="compact"
		/>
	);
}
