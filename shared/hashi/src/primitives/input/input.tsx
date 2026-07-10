import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * Field-surface classes shared by Input and other field-like elements
 * (e.g. a raw textarea): border, background, radius, focus ring, invalid
 * state, disabled state, selection, transition. Deliberately excludes
 * sizing, typography, and file:* tokens — compose those per element.
 */
const inputFieldClassName =
	"border-input dark:bg-input/30 selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground w-full min-w-0 rounded-md border bg-white transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				inputFieldClassName,
				"file:text-foreground h-9 px-3 py-1 text-base file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-sm",
				className
			)}
			{...props}
		/>
	);
}

export { Input, inputFieldClassName };
