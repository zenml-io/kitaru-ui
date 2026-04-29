import { env } from "@/modules/root/domain/env";
import { isRecord } from "@/shared/utils/is-record";
import { useQuery } from "@tanstack/react-query";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import { LOCAL_VERSION_ID } from "../domain/deployment";
import { InvocationOverviewCard } from "../ui/InvocationOverviewCard";
import { LocalOverviewCard } from "../ui/LocalOverviewCard";

function exampleFromSchema(
	schema: Record<string, unknown> | undefined
): Record<string, unknown> {
	if (!schema) return {};
	const props = schema.properties;
	if (!isRecord(props)) return {};
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(props)) {
		const prop = isRecord(value) ? value : {};
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
	const { flowId, deployment } = useCurrentDeployment();
	const { data: realDeployments } = useQuery(deploymentsQueries.list(flowId));

	if (deployment.version === LOCAL_VERSION_ID)
		return (
			<LocalOverviewCard
				flowName={deployment.flowName}
				flowId={flowId}
				hasDeployments={(realDeployments?.length ?? 0) > 0}
			/>
		);

	const origin = env.VITE_API_BASE_URL || window.location.origin;
	const url = `${origin}/api/v1/pipeline_snapshots/${deployment.id}/runs`;
	const exampleInput = exampleFromSchema(deployment.inputSchema);
	const defaultTag = deployment.tags.find((t) => t.kind === "default");
	const tagOrVersionArgs = defaultTag
		? `--tag ${defaultTag.name}`
		: `--version ${deployment.version}`;

	return (
		<InvocationOverviewCard
			url={url}
			flowName={deployment.flowName}
			exampleInput={exampleInput}
			tagOrVersionArgs={tagOrVersionArgs}
		/>
	);
}
