import {
	getStatusDotClass,
	type ExecStatus,
	type FlowStatus,
} from "@zenml/hashi/lib/state-styles";
import { cn } from "@zenml/hashi/lib/utils";

export function StatusDot({
	status,
	className,
}: {
	status: FlowStatus | ExecStatus;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-block h-[7px] w-[7px] shrink-0 rounded-full",
				getStatusDotClass(status),
				className
			)}
		/>
	);
}
