import { DeviceVerificationFormContainer } from "@/modules/device-verification/feature/DeviceVerificationFormContainer";
import { DeviceInfo } from "@/modules/device-verification/ui/DeviceInfo";
import { DeviceVerificationCard } from "@/modules/device-verification/ui/DeviceVerificationCard";
import { DeviceVerificationSuccessState } from "@/modules/device-verification/ui/DeviceVerificationSuccessState";
import {
	SUCCESS_REDIRECT_SECONDS,
	startDeviceVerificationSuccessCountdown,
	type CountdownTimer,
} from "@/modules/device-verification/util/login-countdown";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { deviceQueries } from "../business-logic/device-queries";

type DeviceVerificationFlowProps = {
	deviceId: string;
	userCode: string;
	onVerificationSuccess?: () => void;
};

type Step = "authorize" | "success";

export function DeviceVerificationFlow({
	deviceId,
	userCode,
	onVerificationSuccess,
}: DeviceVerificationFlowProps) {
	const router = useRouter();
	const [step, setStep] = useState<Step>("authorize");
	const [countdown, setCountdown] = useState(SUCCESS_REDIRECT_SECONDS);
	const timerRef = useRef<CountdownTimer | null>(null);

	const { data: device } = useSuspenseQuery({
		...deviceQueries.detail(deviceId, { user_code: userCode }),
	});

	const location =
		device.metadata?.city && device.metadata?.region
			? `${device.metadata?.city ?? ""}, ${device.metadata?.region ?? ""}`
			: undefined;

	const goHome = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		router.navigate({ to: "/" });
	}, [router]);

	useEffect(() => {
		if (step !== "success") {
			return;
		}

		timerRef.current = startDeviceVerificationSuccessCountdown({
			onTick: (secondsRemaining) => {
				setCountdown(secondsRemaining);
			},
			onComplete: goHome,
			totalSeconds: SUCCESS_REDIRECT_SECONDS,
		});

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [goHome, step]);

	function handleVerified() {
		onVerificationSuccess?.();
		setCountdown(SUCCESS_REDIRECT_SECONDS);
		setStep("success");
	}

	return (
		<DeviceVerificationCard showHeader={step === "authorize"}>
			{step === "authorize" ? (
				<>
					<DeviceInfo
						hostname={device.body?.hostname ?? undefined}
						ipAddress={device.body?.ip_address ?? undefined}
						location={location}
					/>
					<DeviceVerificationFormContainer
						deviceId={deviceId}
						onVerified={handleVerified}
						userCode={userCode}
					/>
				</>
			) : (
				<DeviceVerificationSuccessState
					countdown={countdown}
					onContinue={goHome}
				/>
			)}
		</DeviceVerificationCard>
	);
}
