import { fetchDevice } from "@/modules/device-verification/domain/fetch-device";
import type { DeviceQueryParams } from "@/modules/device-verification/domain/device-verification-types";
import { queryOptions } from "@tanstack/react-query";

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
