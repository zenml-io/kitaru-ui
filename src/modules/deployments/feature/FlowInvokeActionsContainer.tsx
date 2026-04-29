import { env } from "@/modules/root/domain/env";
import { Suspense } from "react";
import { useSelectedVersion } from "../business-logic/use-selected-version";
import { isLocalDeployment } from "../domain/local-deployment";
import { InvocationUrlBlock } from "../ui/InvocationUrlBlock";
import { InvokeDeploymentContainer } from "./InvokeDeploymentContainer";
import { Skeleton } from "@/shared/ui/skeleton";

export function FlowInvokeActionsContainer() {
	const { selected } = useSelectedVersion();

	if (!selected || isLocalDeployment(selected)) return null;

	const origin = env.VITE_API_BASE_URL || window.location.origin;
	const url = `${origin}/api/v1/pipeline_snapshots/${selected.id}/runs`;

	return (
		<div className="flex items-center gap-2">
			<InvocationUrlBlock url={url} className="w-[480px] max-w-[50vw]" />
			<Suspense fallback={<Skeleton className="h-8 w-[80px]" />}>
				<InvokeDeploymentContainer deploymentId={selected.id} />
			</Suspense>
		</div>
	);
}
