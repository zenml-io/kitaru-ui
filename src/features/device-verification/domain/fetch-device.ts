import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import { buildUrlWithQueries } from "@/shared/api/utils/build-url";
import { queryOptions } from "@tanstack/react-query";
import type { Device, DeviceQueryParams } from "./device-verification-types";

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

export const deviceQueryKeys = {
	all: ["device"] as const,
	detail: (deviceId: string) => [...deviceQueryKeys.all, deviceId] as const,
};

export const deviceQueries = {
	detail: (deviceId: string, queryParams: DeviceQueryParams = {}) =>
		queryOptions({
			queryKey: [...deviceQueryKeys.detail(deviceId), queryParams],
			queryFn: () => fetchDevice(deviceId, queryParams),
		}),
};
