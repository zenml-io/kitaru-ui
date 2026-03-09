import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type {
	Device,
	DeviceQueryParams,
} from "@/modules/device-verification/domain/device-verification-types";

export async function fetchDevice(
	deviceId: string,
	queryParams: DeviceQueryParams
): Promise<Device> {
	const response = await apiClient.GET("/api/v1/devices/{device_id}", {
		params: {
			path: {
				device_id: deviceId,
			},
			query: queryParams,
		},
	});
	return expectData(response);
}
