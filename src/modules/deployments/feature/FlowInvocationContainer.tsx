import { env } from "@/modules/root/domain/env";
import type { JsonSchema } from "@/shared/api/domain/json-schema";
import { isRecord } from "@/shared/utils/is-record";
import { isLocalDeployment } from "../domain/local-deployment";
import { useSelectedVersion } from "../business-logic/use-selected-version";
import {
	InvocationEmptyState,
	InvocationOverviewCard,
} from "../ui/InvocationOverviewCard";
import { LocalOverviewCard } from "../ui/LocalOverviewCard";

function exampleFromSchema(
	schema: JsonSchema | undefined
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
	const { flowId, flow, realDeployments, selected } = useSelectedVersion();

	if (!selected) return <InvocationEmptyState />;
	if (isLocalDeployment(selected))
		return (
			<LocalOverviewCard
				flowName={flow.name}
				flowId={flowId}
				hasDeployments={realDeployments.length > 0}
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
