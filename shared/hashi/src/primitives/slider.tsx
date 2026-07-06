import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "../lib/utils";

/**
 * Single-thumb slider built on Base UI. Used for continuous 0–1 controls such
 * as LLM temperature. No drop shadow (field-primitive rule) — definition comes
 * from track contrast + a bordered thumb + focus ring.
 */
function Slider({
	className,
	value,
	onValueChange,
	min = 0,
	max = 1,
	step = 0.1,
	disabled,
	"aria-label": ariaLabel,
}: {
	className?: string;
	value: number;
	onValueChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	"aria-label"?: string;
}) {
	return (
		<SliderPrimitive.Root
			value={value}
			onValueChange={(next: number | readonly number[]) =>
				onValueChange(typeof next === "number" ? next : (next[0] ?? min))
			}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			data-slot="slider"
			className={cn(
				"relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
				className
			)}
		>
			<SliderPrimitive.Control className="flex w-full items-center py-1.5">
				<SliderPrimitive.Track className="bg-muted relative h-1.5 w-full grow rounded-full">
					<SliderPrimitive.Indicator className="bg-primary absolute rounded-full" />
					<SliderPrimitive.Thumb
						aria-label={ariaLabel}
						className="border-primary focus-visible:ring-ring/50 block size-4 rounded-full border-2 bg-white outline-none focus-visible:ring-3"
					/>
				</SliderPrimitive.Track>
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
