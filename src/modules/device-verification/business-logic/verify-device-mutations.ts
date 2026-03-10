import type { Device } from "@/modules/device-verification/domain/device-verification-types";
import {
	type VerifyDeviceVariables,
	verifyDevice,
} from "@/modules/device-verification/domain/verify-device";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

export function useVerifyDevice(
	options?: Omit<
		UseMutationOptions<Device, FetchError, VerifyDeviceVariables, unknown>,
		"mutationFn"
	>
) {
	return useMutation({
		...options,
		mutationFn: verifyDevice,
	});
}
