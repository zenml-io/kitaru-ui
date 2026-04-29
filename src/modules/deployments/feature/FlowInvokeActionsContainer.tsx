import { env } from "@/modules/root/domain/env";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import { LOCAL_VERSION_ID } from "../domain/deployment";
import { InvocationUrlBlock } from "../ui/InvocationUrlBlock";
import { InvokeDeploymentContainer } from "./InvokeDeploymentContainer";

export function FlowInvokeActionsContainer() {
	const { deployment } = useCurrentDeployment();

	if (deployment.version === LOCAL_VERSION_ID) return null;

	const origin = env.VITE_API_BASE_URL || window.location.origin;
	const url = `${origin}/api/v1/pipeline_snapshots/${deployment.id}/runs`;

	return (
		<div className="flex items-center gap-2">
			<InvocationUrlBlock url={url} className="w-[480px] max-w-[50vw]" />
			<InvokeDeploymentContainer deployment={deployment} />
		</div>
	);
}
