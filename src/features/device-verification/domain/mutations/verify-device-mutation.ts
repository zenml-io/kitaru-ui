import { apiClient } from "@/shared/api/domain/api-client";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { apiPaths } from "@/shared/api/domain/api-paths";
import {
	type UseMutationOptions,
	mutationOptions,
} from "@tanstack/react-query";
import type { Device, DeviceVerifyPayload } from "../device-verification-types";

export type VerifyDeviceVariables = {
	deviceId: string;
	payload: DeviceVerifyPayload;
};

export async function verifyDevice({
	deviceId,
	payload,
}: VerifyDeviceVariables): Promise<Device> {
	const response = await apiClient(apiPaths.devices.verify(deviceId), {
		method: "PUT",
		body: JSON.stringify(payload),
	});

	const body: Device = await response.json();
	return body;
}

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
