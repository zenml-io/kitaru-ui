import { MeshLayoutFrame } from "@/modules/root/ui/MeshLayoutFrame";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { DeviceVerificationFlow } from "./DeviceVerificationFlow";

export function DeviceVerificationPage() {
	const { device_id, user_code } = useSearch({
		from: "/_private/devices/verify",
	});
	const [isVerificationSuccessful, setIsVerificationSuccessful] =
		useState(false);

	return (
		<MeshLayoutFrame variant={isVerificationSuccessful ? "success" : "default"}>
			<DeviceVerificationFlow
				deviceId={device_id}
				onVerificationSuccess={() => {
					setIsVerificationSuccessful(true);
				}}
				userCode={user_code}
			/>
		</MeshLayoutFrame>
	);
}
