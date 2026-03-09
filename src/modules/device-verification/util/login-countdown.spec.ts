import { afterEach, describe, expect, it, vi } from "vitest";
import { startDeviceVerificationSuccessCountdown } from "./login-countdown";

describe("startDeviceVerificationSuccessCountdown", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("decrements the countdown each second and completes at zero", () => {
		vi.useFakeTimers();
		const onTick = vi.fn();
		const onComplete = vi.fn();

		startDeviceVerificationSuccessCountdown({
			onTick,
			onComplete,
			totalSeconds: 3,
		});

		vi.advanceTimersByTime(1000);
		expect(onTick).toHaveBeenNthCalledWith(1, 2);
		expect(onComplete).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1000);
		expect(onTick).toHaveBeenNthCalledWith(2, 1);
		expect(onComplete).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1000);
		expect(onTick).toHaveBeenNthCalledWith(3, 0);
		expect(onComplete).toHaveBeenCalledTimes(1);
	});
});
