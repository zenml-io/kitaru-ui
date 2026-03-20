import type { ComponentProps } from "react";
import { LoadingButton } from "./LoadingButton";
import { RefreshCcw01 } from "@untitledui/icons";

type RefreshButtonProps = Omit<
	ComponentProps<typeof LoadingButton>,
	"children"
>;

export function RefreshButton({ isLoading, ...props }: RefreshButtonProps) {
	return (
		<LoadingButton isLoading={isLoading} {...props}>
			{!isLoading ? <RefreshCcw01 /> : null}
			Refresh
		</LoadingButton>
	);
}
