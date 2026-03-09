export const SUCCESS_REDIRECT_SECONDS = 5;

export type CountdownTimer = ReturnType<typeof setInterval>;

export function startDeviceVerificationSuccessCountdown({
	onTick,
	onComplete,
	totalSeconds = SUCCESS_REDIRECT_SECONDS,
}: {
	onTick: (secondsRemaining: number) => void;
	onComplete: () => void;
	totalSeconds?: number;
}): CountdownTimer {
	let remainingSeconds = totalSeconds;
	const timerRef: { current: CountdownTimer | null } = {
		current: null,
	};

	const timer = setInterval(() => {
		remainingSeconds -= 1;
		onTick(Math.max(remainingSeconds, 0));

		if (remainingSeconds <= 0) {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
			onComplete();
		}
	}, 1000);

	timerRef.current = timer;
	return timer;
}
