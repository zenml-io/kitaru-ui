import type { ComponentProps } from "react";
import { LoadingButton } from "./LoadingButton";
import { RefreshCcw } from "lucide-react";

type RefreshButtonProps = Omit<
	ComponentProps<typeof LoadingButton>,
	"children"
>;

export function RefreshButton({ isLoading, ...props }: RefreshButtonProps) {
	return (
		<LoadingButton isLoading={isLoading} {...props}>
			{!isLoading ? <RefreshCcw /> : null}
			Refresh
		</LoadingButton>
	);
}
