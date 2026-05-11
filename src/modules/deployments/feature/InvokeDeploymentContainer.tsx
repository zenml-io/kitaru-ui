import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useDeployment } from "../business-logic/use-deployment";
import { useInvokeDeployment } from "../business-logic/use-invoke-deployment";
import { formatVersion } from "../domain/deployment";
import {
	getEditableParameters,
	getParametersJsonSchema,
	mergeRunConfigurationWithParameters,
} from "../domain/invoke-parameters-editor";
import { InvokeSheetContainer } from "./InvokeSheetContainer";

export function InvokeDeploymentContainer({
	deploymentId,
}: {
	deploymentId: string;
}) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const { data: deployment } = useDeployment(deploymentId);

	const defaultValue = JSON.stringify(
		getEditableParameters(deployment.defaultParameters),
		null,
		2
	);
	const parametersSchema = getParametersJsonSchema(deployment.inputSchema);

	const { invokeDeployment, isPending } = useInvokeDeployment(
		deployment.flowId,
		{
			onSuccess: ({ id: executionId }) => {
				setOpen(false);
				toast.success("Invocation started");
				navigate({
					to: "/flows/$flowId/v/$version/executions/$executionId",
					params: {
						flowId: deployment.flowId,
						version: deployment.version,
						executionId,
					},
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
		invokeDeployment({ deploymentId: deployment.id, runConfiguration });
	}

	return (
		<InvokeSheetContainer
			open={open}
			onOpenChange={setOpen}
			deploymentId={deployment.id}
			jsonSchema={parametersSchema}
			title={`Invoke ${deployment.flowName} · ${formatVersion(deployment.version)}`}
			defaultValue={defaultValue}
			isSubmitting={isPending}
			onSubmit={handleSubmit}
		/>
	);
}
