import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Deployment } from "../domain/deployment";
import { LOCAL_VERSION_ID } from "../domain/local-deployment";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { useInvokeDeployment } from "../business-logic/use-invoke-deployment";
import { InvokeButton } from "../ui/InvokeButton";
import { InvokeDrawer } from "../ui/InvokeDrawer";

export function InvokeDeploymentContainer({
	deployment,
}: {
	deployment: Deployment;
}) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const detailQuery = useQuery({
		...deploymentsQueries.detail(deployment.id),
		enabled: open,
	});

	const defaultValue =
		detailQuery.data?.defaultParameters != null
			? JSON.stringify(detailQuery.data.defaultParameters, null, 2)
			: "{}";

	const { invokeDeployment, isPending } = useInvokeDeployment(
		deployment.flowId,
		{
			onSuccess: ({ runId }) => {
				setOpen(false);
				toast.success("Invocation started");
				const versionParam =
					deployment.id === LOCAL_VERSION_ID
						? LOCAL_VERSION_ID
						: deployment.versionNumber;
				navigate({
					to: "/flows/$flowId/v/$version/executions/$executionId",
					params: {
						flowId: deployment.flowId,
						version: versionParam,
						executionId: runId,
					},
				});
			},
			onError: (error) => {
				toast.error(error.message || "Invoke failed");
			},
		}
	);

	function handleSubmit(parameters: Record<string, unknown>) {
		invokeDeployment({ snapshotId: deployment.id, parameters });
	}

	return (
		<>
			<InvokeButton
				onClick={() => setOpen(true)}
				disabled={!deployment.runnable}
			/>
			<InvokeDrawer
				open={open}
				onOpenChange={setOpen}
				title={`Invoke ${deployment.flowName} · v${deployment.versionNumber}`}
				defaultValue={defaultValue}
				isLoading={open && detailQuery.isPending}
				isSubmitting={isPending}
				onSubmit={handleSubmit}
			/>
		</>
	);
}
