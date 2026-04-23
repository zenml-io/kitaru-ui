import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Deployment } from "../domain/deployment";
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
	const { invokeDeployment, isPending } = useInvokeDeployment(
		deployment.flowId,
		{
			onSuccess: ({ runId }) => {
				setOpen(false);
				toast.success("Invocation started");
				navigate({
					to: "/flows/$flowId/executions/$executionId",
					params: { flowId: deployment.flowId, executionId: runId },
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
				schema={deployment.inputSchema}
				isSubmitting={isPending}
				onSubmit={handleSubmit}
			/>
		</>
	);
}
