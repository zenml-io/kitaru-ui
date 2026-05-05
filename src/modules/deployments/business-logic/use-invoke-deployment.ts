import { executionsQueryKeys } from "@/modules/executions/business-logic/executions-queries";
import type { Execution } from "@/modules/executions/domain/execution";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import {
	useMutation,
	type UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";
import {
	invokeDeployment,
	type InvokeDeploymentArgs,
} from "../domain/invoke-deployment";

export function useInvokeDeployment(
	flowId: string,
	options?: Omit<
		UseMutationOptions<Execution, FetchError, InvokeDeploymentArgs, unknown>,
		"mutationFn"
	>
) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		...options,
		mutationFn: invokeDeployment,
		onSuccess: (...args) => {
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.all(flowId),
			});
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.listWithSnapshots(flowId),
			});
			options?.onSuccess?.(...args);
		},
	});

	return {
		...mutation,
		invokeDeployment: mutation.mutate,
		invokeDeploymentAsync: mutation.mutateAsync,
	};
}
