import type { ComponentProps } from "react";
import { Button } from "./button";
import { Loading01 } from "@untitledui/icons";

type Props = ComponentProps<typeof Button> & {
	isLoading?: boolean;
};

export function LoadingButton({
	disabled,
	isLoading,
	children,
	...props
}: Props) {
	return (
		<Button disabled={disabled || isLoading} {...props}>
			{isLoading ? (
				<Loading01 className="animate-spin motion-reduce:animate-none" />
			) : null}
			{children}
		</Button>
	);
}
