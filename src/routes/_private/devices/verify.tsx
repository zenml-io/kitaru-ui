import { deviceQueries } from "@/modules/device-verification/business-logic/device-queries";
import { DeviceVerificationPage } from "@/modules/device-verification/feature/DeviceVerificationPage";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

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
	component: DeviceVerificationPage,
});
