import type { Device } from "@/modules/device-verification/domain/device-verification-types";
import {
	type VerifyDeviceVariables,
	verifyDevice as verifyDeviceRequest,
} from "@/modules/device-verification/domain/verify-device";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

export function useVerifyDevice(
	options?: Omit<
		UseMutationOptions<Device, FetchError, VerifyDeviceVariables, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (variables) =>
			verifyDeviceRequest(variables, { kitaruApiClient }),
	});

	return {
		...mutation,
		verifyDevice: mutation.mutate,
		verifyDeviceAsync: mutation.mutateAsync,
	};
}
