import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executionsQueryKeys } from "@/modules/executions/business-logic/executions-queries";
import { invokeDeployment } from "../domain/invoke-deployment";

export function useInvokeDeployment(flowId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: invokeDeployment,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.all(flowId),
			});
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.listWithSnapshots(flowId),
			});
		},
	});
}
