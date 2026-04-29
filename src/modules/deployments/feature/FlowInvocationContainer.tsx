import { env } from "@/modules/root/domain/env";
import { isRecord } from "@/shared/utils/is-record";
import { useQuery } from "@tanstack/react-query";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { useSelectedDeployment } from "../business-logic/use-selected-deployment";
import { isLocalDeployment } from "../domain/local-deployment";
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
	const { flowId, flow, selected } = useSelectedDeployment();
	const { data: realDeployments } = useQuery(deploymentsQueries.list(flowId));

	if (isLocalDeployment(selected))
		return (
			<LocalOverviewCard
				flowName={flow.name}
				flowId={flowId}
				hasDeployments={(realDeployments?.length ?? 0) > 0}
			/>
		);

	const origin = env.VITE_API_BASE_URL || window.location.origin;
	const url = `${origin}/api/v1/pipeline_snapshots/${selected.id}/runs`;
	const exampleInput = exampleFromSchema(selected.inputSchema);
	const defaultTag = selected.tags.find((t) => t.kind === "default");
	const tagOrVersionArgs = defaultTag
		? `--tag ${defaultTag.name}`
		: `--version ${selected.versionNumber}`;

	return (
		<InvocationOverviewCard
			url={url}
			flowName={selected.flowName}
			exampleInput={exampleInput}
			tagOrVersionArgs={tagOrVersionArgs}
		/>
	);
}
