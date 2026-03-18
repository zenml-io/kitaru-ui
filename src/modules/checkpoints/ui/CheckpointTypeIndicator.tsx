import { cva, type VariantProps } from "class-variance-authority";

type CheckpointType = "tool_call" | "llm_call";

const dotVariants = cva("inline-block h-[7px] w-[7px] shrink-0 rounded-full", {
	variants: {
		type: {
			tool_call: "bg-primary",
			llm_call: "bg-orange-500",
		} satisfies Record<CheckpointType, string>,
	},
	defaultVariants: {
		type: "tool_call",
	},
});

interface CheckpointTypeIndicatorProps {
	type: CheckpointType;
}

const TYPE_LABELS: Record<CheckpointType, string> = {
	tool_call: "Tool",
	llm_call: "LLM",
};

export function CheckpointTypeIndicator({
	type,
}: CheckpointTypeIndicatorProps) {
	return (
		<div className="flex items-center gap-1.5">
			<CheckpointTypeDot type={type} />
			<CheckpointTypeLabel type={type} />
		</div>
	);
}

export function CheckpointTypeDot({ type }: VariantProps<typeof dotVariants>) {
	return (
		<span
			data-slot="checkpoint-type-dot"
			data-type={type}
			className={dotVariants({ type })}
		/>
	);
}

export function CheckpointTypeLabel({ type }: { type: CheckpointType }) {
	return <span className="text-xs">{TYPE_LABELS[type]}</span>;
}
