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
	const { mutate, isPending } = useInvokeDeployment(deployment.flowId);

	function handleSubmit(parameters: Record<string, unknown>) {
		mutate(
			{ snapshotId: deployment.id, parameters },
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
					toast.error(error instanceof Error ? error.message : "Invoke failed");
				},
			}
		);
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
				schema={deployment.inputSchema ?? {}}
				isSubmitting={isPending}
				onSubmit={handleSubmit}
			/>
		</>
	);
}
