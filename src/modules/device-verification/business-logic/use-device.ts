import { useSuspenseQuery } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import type { DeviceQueryParams } from "../domain/device-verification-types";
import { deviceQueries } from "./device-queries";

type SuspenseOptions = Omit<
	ReturnType<typeof deviceQueries.detail>,
	"queryKey" | "queryFn"
>;

export function useDevice(
	deviceId: string,
	queryParams: DeviceQueryParams = {},
	opts: SuspenseOptions = {}
) {
	const kitaruApiRuntime = useKitaruApiRuntime();
	const query = useSuspenseQuery({
		...deviceQueries.detail({ deviceId, queryParams }, kitaruApiRuntime),
		...opts,
	});

	return { ...query, deviceData: query.data };
}
