import {
	type VerifyDeviceVariables,
	verifyDevice,
} from "@/modules/device-verification/domain/verify-device";
import type { Device } from "@/modules/device-verification/domain/device-verification-types";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import {
	type UseMutationOptions,
	mutationOptions,
} from "@tanstack/react-query";

export function verifyDeviceMutationOptions(
	options?: Omit<
		UseMutationOptions<Device, FetchError, VerifyDeviceVariables, unknown>,
		"mutationFn"
	>
) {
	return mutationOptions({
		...options,
		mutationFn: verifyDevice,
	});
}
