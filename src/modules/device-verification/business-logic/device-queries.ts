import { fetchDevice } from "@/modules/device-verification/domain/fetch-device";
import type { DeviceQueryParams } from "@/modules/device-verification/domain/device-verification-types";
import { queryOptions } from "@tanstack/react-query";
import type { KitaruApiRuntime } from "@zenml/shared-kitaru/api";

export type DeviceDetailQueryArgs = {
	deviceId: string;
	queryParams?: DeviceQueryParams;
};

export const deviceQueryKeys = {
	all: (scopeKey: string) => [scopeKey, "device"] as const,
	detail: (scopeKey: string, deviceId: string) =>
		[...deviceQueryKeys.all(scopeKey), deviceId] as const,
};

export const deviceQueries = {
	detail: (
		{ deviceId, queryParams = {} }: DeviceDetailQueryArgs,
		{ kitaruApiClient, scopeKey }: KitaruApiRuntime
	) =>
		queryOptions({
			queryKey: [...deviceQueryKeys.detail(scopeKey, deviceId), queryParams],
			queryFn: () =>
				fetchDevice({ deviceId, queryParams }, { kitaruApiClient }),
		}),
};
