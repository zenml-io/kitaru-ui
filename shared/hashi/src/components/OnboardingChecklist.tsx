import {
	useEffect,
	useId,
	useRef,
	useState,
	type PropsWithChildren,
	type ReactNode,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../primitives/collapsible";
import { Card } from "../primitives/card";
import { cn } from "../lib/utils";
import { normalizeOnboardingProgress } from "../lib/onboarding";
import { OnboardingProgressBar } from "./OnboardingProgress";

export type OnboardingItemState = {
	isCompleted: boolean;
	isActive: boolean;
	hasDownstreamStep: boolean;
};

type ChecklistProps = {
	title: string;
	subtitle?: string;
	itemsDone: number;
	totalItems: number;
	children: ReactNode;
	className?: string;
	progressLabel?: string;
	stepsLabel?: string;
};

type ItemProps = OnboardingItemState & {
	index: number;
	title: string;
	meta?: string;
	className?: string;
	triggerRef?: React.Ref<HTMLButtonElement>;
};

function OnboardingStepCircle({
	index,
	isCompleted,
	isActive,
}: Pick<ItemProps, "index" | "isCompleted" | "isActive">) {
	if (isCompleted) {
		return (
			<span
				className="bg-primary flex size-5.5 shrink-0 items-center justify-center rounded-full"
				aria-hidden="true"
			>
				<Check className="text-primary-foreground size-3" strokeWidth={3} />
			</span>
		);
	}

	return (
		<span
			className={cn(
				"flex size-5.5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold tabular-nums",
				isActive
					? "border-primary text-primary"
					: "border-muted-foreground/40 text-muted-foreground"
			)}
			aria-hidden="true"
		>
			{index}
		</span>
	);
}

function getStatusText({
	isCompleted,
	isActive,
	hasDownstreamStep,
}: OnboardingItemState): string {
	if (isCompleted) return "Complete";
	if (hasDownstreamStep) return "Skipped";
	if (isActive) return "Current";
	return "Not started";
}

export function OnboardingChecklist({
	title,
	subtitle,
	itemsDone,
	totalItems,
	children,
	className,
	progressLabel = "Onboarding progress",
	stepsLabel = "Onboarding steps",
}: ChecklistProps) {
	const headingId = useId();
	const {
		itemsDone: safeDone,
		totalItems: safeTotal,
		progress,
	} = normalizeOnboardingProgress(itemsDone, totalItems);

	return (
		<Card
			className={cn("flex flex-col gap-5 p-6", className)}
			aria-labelledby={headingId}
		>
			<div className="flex flex-col gap-1">
				<h2
					id={headingId}
					className="text-foreground text-lg font-semibold text-balance"
				>
					{title}
				</h2>
				{subtitle ? (
					<p className="text-muted-foreground text-sm text-pretty">
						{subtitle}
					</p>
				) : null}
				<div className="flex items-center gap-3 pt-2.5">
					<OnboardingProgressBar
						value={progress}
						label={progressLabel}
						className="flex-1"
					/>
					<span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
						{safeDone} of {safeTotal} complete
					</span>
				</div>
			</div>
			<ul className="flex flex-col gap-2.5" aria-label={stepsLabel}>
				{children}
			</ul>
		</Card>
	);
}

export function OnboardingChecklistItem({
	index,
	title,
	meta,
	isCompleted,
	isActive,
	hasDownstreamStep,
	children,
	className,
	triggerRef,
}: PropsWithChildren<ItemProps>) {
	const isSkipped = !isCompleted && hasDownstreamStep;
	const isCurrent = isActive && !isSkipped;
	const [open, setOpen] = useState(isCurrent);
	const wasActive = useRef(isCurrent);

	useEffect(() => {
		if (isCurrent && !wasActive.current) setOpen(true);
		if (!isCurrent && wasActive.current) setOpen(false);
		wasActive.current = isCurrent;
	}, [isCurrent]);

	const status = { isCompleted, isActive, hasDownstreamStep };
	const statusText = getStatusText(status);
	const rowClassName = cn(
		"bg-card rounded-lg border",
		isCurrent && open ? "border-foreground/30" : "border-border",
		!isCompleted && !isCurrent && "text-muted-foreground",
		className
	);
	const titleElement = (
		<span
			className={cn(
				"text-sm",
				isCompleted
					? "text-muted-foreground font-medium line-through"
					: isCurrent
						? "text-foreground font-semibold"
						: "text-muted-foreground font-medium"
			)}
		>
			{title}
			{isSkipped ? null : <span className="sr-only"> {statusText}</span>}
		</span>
	);
	const trailingElement = isSkipped ? (
		<span className="text-muted-foreground text-xs font-medium">Skipped</span>
	) : isCurrent ? (
		<span className="text-primary text-xs font-semibold">Now</span>
	) : meta ? (
		<span className="text-muted-foreground text-xs">{meta}</span>
	) : null;
	const leadingElement = (
		<span className="flex items-center gap-3">
			<OnboardingStepCircle
				index={index}
				isCompleted={isCompleted}
				isActive={isCurrent}
			/>
			{titleElement}
		</span>
	);

	if (children === undefined || children === null) {
		return (
			<li
				className={cn(
					rowClassName,
					"flex items-center justify-between gap-4 p-4"
				)}
			>
				<h3>{leadingElement}</h3>
				<span className="shrink-0">{trailingElement}</span>
			</li>
		);
	}

	return (
		<li className={rowClassName}>
			<Collapsible open={open} onOpenChange={setOpen}>
				<h3>
					<CollapsibleTrigger
						ref={triggerRef}
						className={cn(
							"focus-visible:ring-ring/50 flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg p-4 transition-colors outline-none focus-visible:ring-3",
							!open && "hover:bg-accent/40"
						)}
					>
						{leadingElement}
						<span className="flex shrink-0 items-center gap-2.5">
							{trailingElement}
							<ChevronDown
								className={cn(
									"text-muted-foreground size-4 transition-transform",
									open && "rotate-180"
								)}
								aria-hidden="true"
							/>
						</span>
					</CollapsibleTrigger>
				</h3>
				<CollapsibleContent className="overflow-hidden">
					<div className="flex flex-col gap-5 px-4 pb-4">{children}</div>
				</CollapsibleContent>
			</Collapsible>
		</li>
	);
}
