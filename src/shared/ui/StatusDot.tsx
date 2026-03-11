import { cva, type VariantProps } from "class-variance-authority";

const statusDotVariants = cva(
	"inline-block h-[7px] w-[7px] shrink-0 rounded-full",
	{
		variants: {
			variant: {
				success: "bg-success",
				danger: "bg-destructive",
				warning: "bg-warning",
			},
		},
		defaultVariants: {
			variant: "warning",
		},
	}
);

export type StatusDotVariant = NonNullable<
	VariantProps<typeof statusDotVariants>["variant"]
>;

function StatusDot({ variant = "warning" }: { variant?: StatusDotVariant }) {
	return (
		<span
			data-slot="status-dot"
			data-variant={variant}
			className={statusDotVariants({ variant })}
		/>
	);
}

export { StatusDot };
