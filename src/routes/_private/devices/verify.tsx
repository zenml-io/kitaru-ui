import { deviceQueries } from "@/modules/device-verification/business-logic/device-queries";
import { DeviceVerificationFlow } from "@/modules/device-verification/feature/DeviceVerificationFlow";
import { MeshLayoutFrame } from "@/modules/root/ui/MeshLayoutFrame";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

const querySchema = z.object({
	device_id: z.string().min(1, "Device ID is required"),
	user_code: z.string().min(1, "User code is required"),
});

export const Route = createFileRoute("/_private/devices/verify")({
	validateSearch: querySchema,
	loaderDeps: ({ search: { device_id, user_code } }) => ({
		device_id,
		user_code,
	}),
	loader: async ({ context, deps }) => {
		return Promise.all([
			context.queryClient.ensureQueryData(
				deviceQueries.detail(deps.device_id, { user_code: deps.user_code })
			),
		]);
	},
	head: () => ({
		meta: [{ title: buildPageTitles("Verify Device") }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { device_id, user_code } = Route.useSearch();
	const [isVerificationSuccessful, setIsVerificationSuccessful] =
		useState(false);
	const { data: device } = useSuspenseQuery({
		...deviceQueries.detail(device_id, { user_code }),
	});

	const location =
		device.metadata?.city && device.metadata?.region
			? `${device.metadata?.city ?? ""}, ${device.metadata?.region ?? ""}`
			: undefined;

	return (
		<MeshLayoutFrame variant={isVerificationSuccessful ? "success" : "default"}>
			<DeviceVerificationFlow
				deviceId={device_id}
				hostname={device.body?.hostname ?? undefined}
				ipAddress={device.body?.ip_address ?? undefined}
				location={location}
				onVerificationSuccess={() => {
					setIsVerificationSuccessful(true);
				}}
				userCode={user_code}
			/>
		</MeshLayoutFrame>
	);
}
