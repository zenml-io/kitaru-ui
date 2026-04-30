import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { useInvokeDeployment } from "../business-logic/use-invoke-deployment";
import { InvokeSheet } from "../ui/InvokeSheet";

export function InvokeDeploymentContainer({
	deploymentId,
}: {
	deploymentId: string;
}) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const { data: deployment } = useSuspenseQuery({
		...deploymentsQueries.detail(deploymentId),
	});

	const defaultValue = deployment.defaultParameters
		? JSON.stringify(deployment.defaultParameters, null, 2)
		: "{}";

	const { invokeDeployment, isPending } = useInvokeDeployment(
		deployment.flowId,
		{
			onSuccess: ({ runId }) => {
				setOpen(false);
				toast.success("Invocation started");
				navigate({
					to: "/flows/$flowId/executions/$executionId",
					params: { flowId: deployment.flowId, executionId: runId },
					search: { version: deployment.versionNumber },
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
		<InvokeSheet
			open={open}
			onOpenChange={setOpen}
			snapshotId={deployment.id}
			jsonSchema={deployment.inputSchema}
			title={`Invoke ${deployment.flowName} · v${deployment.versionNumber}`}
			defaultValue={defaultValue}
			isSubmitting={isPending}
			onSubmit={handleSubmit}
		/>
	);
}
