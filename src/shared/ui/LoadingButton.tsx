import type { ComponentProps } from "react";
import { Button } from "./button";
import { Loader } from "lucide-react";

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
				<Loader className="animate-spin motion-reduce:animate-none" />
			) : null}
			{children}
		</Button>
	);
}
