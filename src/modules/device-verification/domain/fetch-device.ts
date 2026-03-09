import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import { buildUrlWithQueries } from "@/shared/api/utils/build-url";
import type {
	Device,
	DeviceQueryParams,
} from "@/modules/device-verification/domain/device-verification-types";

export async function fetchDevice(
	deviceId: string,
	queryParams: DeviceQueryParams
): Promise<Device> {
	const url = buildUrlWithQueries(
		apiPaths.devices.detail(deviceId),
		queryParams
	);
	const res = await apiClient(url, {
		method: "GET",
	});
	const body: Device = await res.json();
	return body;
}
