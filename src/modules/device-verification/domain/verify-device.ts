import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import type {
	Device,
	DeviceVerifyPayload,
} from "@/modules/device-verification/domain/device-verification-types";

export type VerifyDeviceVariables = {
	deviceId: string;
	payload: DeviceVerifyPayload;
};

export type VerifyDeviceArgs = VerifyDeviceVariables;

export async function verifyDevice(
	{ deviceId, payload }: VerifyDeviceArgs,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<Device> {
	const response = await kitaruApiClient.PUT(
		"/api/v1/devices/{device_id}/verify",
		{
			params: {
				path: {
					device_id: deviceId,
				},
			},
			body: payload,
		}
	);

	return expectData(response);
}
