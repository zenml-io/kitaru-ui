import { env } from "@/modules/root/domain/env";
import { isLocalDeployment } from "../domain/local-deployment";
import { useSelectedDeployment } from "../business-logic/use-selected-deployment";
import { InvocationUrlBlock } from "../ui/InvocationUrlBlock";
import { InvokeDeploymentContainer } from "./InvokeDeploymentContainer";

export function FlowInvokeActionsContainer() {
	const { selected } = useSelectedDeployment();

	if (isLocalDeployment(selected)) return null;

	const origin = env.VITE_API_BASE_URL || window.location.origin;
	const url = `${origin}/api/v1/pipeline_snapshots/${selected.id}/runs`;

	return (
		<div className="flex items-center gap-2">
			<InvocationUrlBlock url={url} className="w-[480px] max-w-[50vw]" />
			<InvokeDeploymentContainer deployment={selected} />
		</div>
	);
}
