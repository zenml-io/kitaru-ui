import { Progress } from "../primitives/progress";
import { cn } from "../lib/utils";

type OnboardingProgressProps = {
	value: number;
	label?: string;
	className?: string;
};

type OnboardingProgressRingProps = OnboardingProgressProps & {
	size?: number;
	strokeWidth?: number;
	decorative?: boolean;
};

function clampPercentage(value: number): number {
	return Math.min(100, Math.max(0, value));
}

export function OnboardingProgressBar({
	value,
	label = `${Math.round(clampPercentage(value))}% complete`,
	className,
}: OnboardingProgressProps) {
	const safeValue = clampPercentage(value);

	return (
		<Progress
			value={safeValue}
			aria-label={label}
			className={cn("block w-full", className)}
		/>
	);
}

export function OnboardingProgressRing({
	value,
	label,
	size = 24,
	strokeWidth = 2.5,
	decorative = false,
	className,
}: OnboardingProgressRingProps) {
	const safeValue = clampPercentage(value);
	const center = size / 2;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference * (1 - safeValue / 100);

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			className={cn("shrink-0", className)}
			role={decorative ? undefined : "img"}
			aria-hidden={decorative || undefined}
			aria-label={
				decorative ? undefined : (label ?? `${Math.round(safeValue)}% complete`)
			}
		>
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				className="text-muted"
			/>
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeDashoffset={strokeDashoffset}
				transform={`rotate(-90 ${center} ${center})`}
				className="text-primary motion-safe:transition-[stroke-dashoffset] motion-safe:duration-300"
			/>
		</svg>
	);
}
