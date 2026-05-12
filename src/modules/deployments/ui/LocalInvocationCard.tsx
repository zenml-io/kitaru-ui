import { LOCAL_VERSION_ID } from "@/modules/deployments/domain/deployment";
import { Button } from "@/shared/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";

export function LocalInvocationCard({
	flowName,
	flowId,
	hasDeployments,
}: {
	flowName: string;
	flowId: string;
	hasDeployments: boolean;
}) {
	return (
		<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
			<div className="border-border bg-card flex items-start gap-3 rounded-md border p-5">
				<div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
					<Info className="text-muted-foreground size-4" aria-hidden />
				</div>
				<div className="min-w-0 flex-1">
					{hasDeployments ? (
						<LocalWithDeployments flowName={flowName} />
					) : (
						<LocalWithoutDeployments flowName={flowName} />
					)}
					<div className="mt-4">
						<Button
							nativeButton={false}
							size="sm"
							variant="outline"
							render={
								<Link
									to="/flows/$flowId/v/$version/$tab"
									params={{
										flowId,
										version: LOCAL_VERSION_ID,
										tab: "executions",
									}}
								/>
							}
						>
							View executions
							<ArrowRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function LocalWithoutDeployments({ flowName }: { flowName: string }) {
	return (
		<>
			<h2 className="text-sm font-semibold">Running locally</h2>
			<p className="text-muted-foreground mt-1 text-xs">
				<code className="font-mono text-xs">{flowName}</code> hasn't been
				published as a deployment yet. Publish a version with the CLI to invoke
				this flow over HTTP and route traffic with tags.
			</p>
			<pre className="bg-muted/40 text-foreground mt-3 rounded px-3 py-2 font-mono text-xs">
				<code>kitaru deploy path/to/file.py:{flowName}</code>
			</pre>
		</>
	);
}

function LocalWithDeployments({ flowName }: { flowName: string }) {
	return (
		<>
			<h2 className="text-sm font-semibold">Viewing local runs</h2>
			<p className="text-muted-foreground mt-1 text-xs">
				You're viewing local runs of{" "}
				<code className="font-mono text-xs">{flowName}</code>. Switch to a
				deployed version in the version selector to invoke this flow over HTTP.
			</p>
		</>
	);
}
