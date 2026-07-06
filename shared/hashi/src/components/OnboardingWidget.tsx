import { ArrowRight, Check, ChevronDown, ChevronUp, Minus } from "lucide-react";
import { Button } from "../primitives/button";
import { Card } from "../primitives/card";
import { cn } from "../lib/utils";
import { normalizeOnboardingProgress } from "../lib/onboarding";
import {
	OnboardingProgressBar,
	OnboardingProgressRing,
} from "./OnboardingProgress";

export type OnboardingWidgetStepState =
	| "done"
	| "skipped"
	| "current"
	| "upcoming";

export type OnboardingWidgetItem = {
	id: string;
	label: string;
	state: OnboardingWidgetStepState;
};

type OnboardingWidgetStepRowProps = OnboardingWidgetItem & {
	onSelect?: () => void;
};

type OnboardingWidgetCardProps = {
	title: string;
	items: readonly OnboardingWidgetItem[];
	itemsDone: number;
	totalItems: number;
	onSelectStep?: (id: string) => void;
	onResume?: () => void;
	onDismiss?: () => void;
	onCollapse?: () => void;
	className?: string;
};

type OnboardingWidgetPillProps = {
	title: string;
	itemsDone: number;
	totalItems: number;
	onExpand: () => void;
	className?: string;
};

export function OnboardingWidgetStepRow({
	id: _id,
	label,
	state,
	onSelect,
}: OnboardingWidgetStepRowProps) {
	const isInteractive = state !== "done" && onSelect !== undefined;
	const statusSquare = (
		<span
			className={cn(
				"mt-px flex size-5 shrink-0 items-center justify-center rounded-md border-2",
				state === "done" && "bg-success border-transparent",
				state === "skipped" &&
					"border-muted-foreground/40 text-muted-foreground",
				state === "current" && "border-primary bg-card",
				state === "upcoming" && "border-muted-foreground/40"
			)}
			aria-hidden="true"
		>
			{state === "done" ? (
				<Check className="text-success-foreground size-3" strokeWidth={3} />
			) : state === "skipped" ? (
				<Minus className="size-3" strokeWidth={3} />
			) : null}
		</span>
	);
	const text = (
		<span className="flex min-w-0 flex-col gap-px">
			<span
				className={cn(
					"text-sm leading-snug",
					state === "current"
						? "text-foreground font-semibold"
						: "text-muted-foreground"
				)}
			>
				{label}
				{state === "skipped" ? null : (
					<span className="sr-only">
						{state === "done"
							? " Complete"
							: state === "current"
								? " Current"
								: " Not started"}
					</span>
				)}
			</span>
			{state === "current" ? (
				<span className="text-primary text-xs leading-tight font-medium">
					Up next
				</span>
			) : state === "skipped" ? (
				<span className="text-muted-foreground text-xs leading-tight font-medium">
					Skipped
				</span>
			) : null}
		</span>
	);

	if (!isInteractive) {
		return (
			<li
				className={cn(
					"flex items-start gap-2.5 rounded-md px-2 py-1.5",
					state === "current" && "bg-primary/5"
				)}
			>
				{statusSquare}
				{text}
			</li>
		);
	}

	return (
		<li>
			<Button
				variant="ghost"
				onClick={onSelect}
				className={cn(
					"h-auto w-full shrink justify-start gap-2.5 rounded-md px-2 py-1.5 text-left whitespace-normal",
					state === "current"
						? "bg-primary/5 hover:bg-primary/10"
						: "hover:bg-accent/50"
				)}
			>
				{statusSquare}
				{text}
			</Button>
		</li>
	);
}

export function OnboardingWidgetCard({
	title,
	items,
	itemsDone,
	totalItems,
	onSelectStep,
	onResume,
	onDismiss,
	onCollapse,
	className,
}: OnboardingWidgetCardProps) {
	const {
		itemsDone: safeDone,
		totalItems: safeTotal,
		progress: percentage,
	} = normalizeOnboardingProgress(itemsDone, totalItems);

	return (
		<Card
			className={cn("flex w-80 flex-col gap-3.5 p-4 py-4 shadow-lg", className)}
		>
			<div className="flex flex-col gap-2.5">
				<div className="flex items-center justify-between gap-2">
					<h2 className="text-foreground text-sm font-semibold">{title}</h2>
					<div className="flex items-center gap-1.5">
						<span className="text-primary text-xs font-semibold tabular-nums">
							{safeDone} of {safeTotal}
						</span>
						{onCollapse ? (
							<Button
								variant="ghost"
								size="icon-xs"
								onClick={onCollapse}
								aria-label="Collapse checklist"
								aria-expanded="true"
							>
								<ChevronDown aria-hidden="true" />
							</Button>
						) : null}
					</div>
				</div>
				<OnboardingProgressBar value={percentage} label="Setup progress" />
			</div>

			<ul className="flex flex-col gap-0.5" aria-label="Setup steps">
				{items.map((item) => (
					<OnboardingWidgetStepRow
						key={item.id}
						{...item}
						onSelect={onSelectStep ? () => onSelectStep(item.id) : undefined}
					/>
				))}
			</ul>

			{onDismiss || onResume ? (
				<div className="border-border flex items-center justify-between border-t pt-3">
					{onDismiss ? (
						<Button variant="ghost" size="sm" onClick={onDismiss}>
							Dismiss
						</Button>
					) : null}
					{onResume ? (
						<Button size="sm" onClick={onResume}>
							Resume setup
							<ArrowRight aria-hidden="true" />
						</Button>
					) : null}
				</div>
			) : null}
		</Card>
	);
}

export function OnboardingWidgetPill({
	title,
	itemsDone,
	totalItems,
	onExpand,
	className,
}: OnboardingWidgetPillProps) {
	const {
		itemsDone: safeDone,
		totalItems: safeTotal,
		progress: percentage,
	} = normalizeOnboardingProgress(itemsDone, totalItems);

	return (
		<Button
			variant="ghost"
			onClick={onExpand}
			aria-label={`${title}, ${safeDone} of ${safeTotal} complete. Expand checklist.`}
			className={cn(
				"bg-card hover:bg-accent/50 h-auto gap-2.5 rounded-full border py-2 pr-4 pl-2.5 shadow-lg",
				className
			)}
		>
			<OnboardingProgressRing value={percentage} decorative />
			<span className="text-primary text-xs font-semibold tabular-nums">
				{safeDone} of {safeTotal}
			</span>
			<span className="text-foreground text-sm font-medium">{title}</span>
			<ChevronUp className="text-muted-foreground" aria-hidden="true" />
		</Button>
	);
}
