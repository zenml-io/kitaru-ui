import { env } from "@/modules/root/domain/env";
import { Skeleton } from "@/shared/ui/skeleton";
import { Suspense } from "react";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import { InvocationUrlBlock } from "../ui/InvocationUrlBlock";
import { InvokeDeploymentContainer } from "./InvokeDeploymentContainer";
import { LOCAL_VERSION_ID } from "../domain/deployment";

export function FlowInvokeActionsContainer() {
	const { deployment } = useCurrentDeployment();

	if (deployment.version === LOCAL_VERSION_ID) return null;
	if (!deployment.runnable) return null;

	const origin = env.VITE_API_BASE_URL || window.location.origin;
	const url = `${origin}/api/v1/pipeline_snapshots/${deployment.id}/runs`;

	return (
		<div className="flex items-center gap-2">
			<InvocationUrlBlock url={url} className="w-[480px] max-w-[50vw]" />
			<Suspense fallback={<Skeleton className="h-8 w-[80px]" />}>
				<InvokeDeploymentContainer deploymentId={deployment.id} />
			</Suspense>
		</div>
	);
}
