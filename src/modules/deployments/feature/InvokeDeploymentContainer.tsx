import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
	getEditableParameters,
	getParametersJsonSchema,
	mergeRunConfigurationWithParameters,
} from "../domain/invoke-parameters-editor";
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

	const defaultValue = JSON.stringify(
		getEditableParameters(deployment.defaultParameters),
		null,
		2
	);
	const parametersSchema = getParametersJsonSchema(deployment.inputSchema);

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
		const runConfiguration = mergeRunConfigurationWithParameters(
			deployment.defaultParameters,
			parameters
		);
		invokeDeployment({ snapshotId: deployment.id, runConfiguration });
	}

	return (
		<InvokeSheet
			open={open}
			onOpenChange={setOpen}
			snapshotId={deployment.id}
			jsonSchema={parametersSchema}
			title={`Invoke ${deployment.flowName} · v${deployment.versionNumber}`}
			defaultValue={defaultValue}
			isSubmitting={isPending}
			onSubmit={handleSubmit}
		/>
	);
}
