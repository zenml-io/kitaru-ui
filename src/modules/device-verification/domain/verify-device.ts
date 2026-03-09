import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type {
	Device,
	DeviceVerifyPayload,
} from "@/modules/device-verification/domain/device-verification-types";

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
