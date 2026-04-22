import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { env } from "@/modules/root/domain/env";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { resolveSelectedDeployment } from "../business-logic/resolve-deployment";
import { InvocationSnippets } from "../ui/InvocationSnippets";
import { InvocationUrlBlock } from "../ui/InvocationUrlBlock";

type JsonSchemaProp = {
	type?: string;
	default?: unknown;
	example?: unknown;
};

type JsonSchema = {
	properties?: Record<string, JsonSchemaProp>;
};

function exampleFromSchema(
	schema: Record<string, unknown> | undefined
): Record<string, unknown> {
	const props = (schema as JsonSchema | undefined)?.properties ?? {};
	const out: Record<string, unknown> = {};
	for (const [key, prop] of Object.entries(props)) {
		if (prop.example !== undefined) out[key] = prop.example;
		else if (prop.default !== undefined) out[key] = prop.default;
		else if (prop.type === "number" || prop.type === "integer") out[key] = 0;
		else if (prop.type === "boolean") out[key] = false;
		else if (prop.type === "array") out[key] = [];
		else if (prop.type === "object") out[key] = {};
		else out[key] = `<${key}>`;
	}
	return out;
}

export function FlowInvocationContainer() {
	const { flowId } = useParams({ from: "/_private/_navbar/flows/$flowId" });
	const { version } = useSearch({
		from: "/_private/_navbar/flows/$flowId",
	});
	const { data: deployments } = useSuspenseQuery(
		deploymentsQueries.list(flowId)
	);
	const selected = resolveSelectedDeployment(deployments, version);

	if (!selected) {
		return (
			<div className="text-muted-foreground container mx-auto px-4 py-6 text-sm sm:px-6 lg:px-8">
				No deployments yet — there's nothing to invoke.
			</div>
		);
	}

	const origin = env.VITE_API_BASE_URL || window.location.origin;
	const url = `${origin}/api/v1/pipeline_snapshots/${selected.id}/runs`;
	const exampleInput = exampleFromSchema(selected.inputSchema);
	const defaultTag = selected.tags.find((t) => t.kind === "default");
	const tagOrVersionArgs = defaultTag
		? `--tag ${defaultTag.name}`
		: `--version ${selected.versionNumber}`;

	return (
		<div className="container mx-auto grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
			<div>
				<h2 className="text-base font-semibold">Invoke</h2>
				<p className="text-muted-foreground mt-1 text-sm">
					Authenticate with a workspace API key. Routing resolves via the{" "}
					<code className="font-mono text-xs">default</code> tag unless you pin
					a specific version at call time.
				</p>
				<div className="mt-3">
					<InvocationUrlBlock url={url} />
				</div>
			</div>
			<InvocationSnippets
				url={url}
				flowName={selected.flowName}
				exampleInput={exampleInput}
				tagOrVersionArgs={tagOrVersionArgs}
			/>
		</div>
	);
}
