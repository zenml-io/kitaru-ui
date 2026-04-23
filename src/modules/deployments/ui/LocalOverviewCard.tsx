import { Info } from "lucide-react";

export function LocalOverviewCard({ flowName }: { flowName: string }) {
	return (
		<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
			<div className="border-border bg-card flex items-start gap-3 rounded-md border p-5">
				<div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
					<Info className="text-muted-foreground size-4" aria-hidden />
				</div>
				<div className="min-w-0 flex-1">
					<h2 className="text-sm font-semibold">Running locally</h2>
					<p className="text-muted-foreground mt-1 text-xs">
						These runs of <code className="font-mono text-xs">{flowName}</code>{" "}
						haven't been published as a deployment yet. Publish a version with
						the CLI to invoke this flow over HTTP and route traffic with tags.
					</p>
					<pre className="bg-muted/40 text-foreground mt-3 rounded px-3 py-2 font-mono text-xs">
						<code>kitaru deploy {flowName}</code>
					</pre>
				</div>
			</div>
		</div>
	);
}
