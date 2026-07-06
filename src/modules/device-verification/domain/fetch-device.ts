import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import type {
	Device,
	DeviceQueryParams,
} from "@/modules/device-verification/domain/device-verification-types";

export type FetchDeviceArgs = {
	deviceId: string;
	queryParams: DeviceQueryParams;
};

export async function fetchDevice(
	{ deviceId, queryParams }: FetchDeviceArgs,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<Device> {
	const response = await kitaruApiClient.GET("/api/v1/devices/{device_id}", {
		params: {
			path: {
				device_id: deviceId,
			},
			query: queryParams,
		},
	});
	return expectData(response);
}
