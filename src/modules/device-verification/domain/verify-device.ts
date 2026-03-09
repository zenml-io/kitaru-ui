import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
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
	const response = await apiClient.PUT("/api/v1/devices/{device_id}/verify", {
		params: {
			path: {
				device_id: deviceId,
			},
		},
		body: payload,
	});

	return expectData(response);
}
