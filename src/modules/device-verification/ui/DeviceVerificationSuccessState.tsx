import { Button } from "@zenml/hashi/primitives/button";

type DeviceVerificationSuccessStateProps = {
	countdown: number;
	onContinue: () => void;
};

export function DeviceVerificationSuccessState({
	countdown,
	onContinue,
}: DeviceVerificationSuccessStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-5 text-center">
			<svg
				aria-hidden="true"
				className="text-success size-16"
				fill="none"
				viewBox="0 0 64 64"
			>
				<circle
					className="fill-success/15"
					cx="32"
					cy="32"
					r="30"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				<path
					d="M20 33l8 8 16-18"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="3"
				/>
			</svg>
			<div className="flex flex-col gap-1.5">
				<h2 className="text-foreground text-lg font-semibold text-balance">
					You successfully added your device
				</h2>
				<p className="text-muted-foreground text-sm text-pretty">
					You may close this screen and return to your CLI
				</p>
			</div>
			<Button onClick={onContinue} type="button">
				Continue to Home ({countdown}s)
			</Button>
		</div>
	);
}
