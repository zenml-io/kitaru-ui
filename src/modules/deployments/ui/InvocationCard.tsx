import { InvocationSnippets } from "./InvocationSnippets";
import { InvocationUrlBlock } from "./InvocationUrlBlock";

export function InvocationCard({
	url,
	flowName,
	exampleInput,
	tagOrVersionArgs,
}: {
	url: string;
	flowName: string;
	exampleInput: Record<string, unknown>;
	tagOrVersionArgs: string;
}) {
	return (
		<div className="container mx-auto grid items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
			<div className="border-border bg-card rounded-md border p-5">
				<h2 className="text-sm font-semibold">Invoke</h2>
				<p className="text-muted-foreground mt-1 text-xs">
					Authenticate with a workspace API key. This URL is pinned to the
					selected snapshot. The CLI example routes via the{" "}
					<code className="font-mono text-xs">default</code> tag instead.
				</p>
				<div className="mt-4">
					<InvocationUrlBlock url={url} className="max-w-full" />
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<InvocationSnippets
					url={url}
					flowName={flowName}
					exampleInput={exampleInput}
					tagOrVersionArgs={tagOrVersionArgs}
				/>
			</div>
		</div>
	);
}

export function InvocationEmptyState() {
	return (
		<div className="text-muted-foreground container mx-auto px-4 py-6 text-sm sm:px-6 lg:px-8">
			No deployments yet — there's nothing to invoke.
		</div>
	);
}
