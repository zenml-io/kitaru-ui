import { cn } from "@/shared/utils/styles";
import { Loading02 } from "@untitledui/icons";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
	return (
		<Loading02
			role="status"
			aria-label="Loading"
			className={cn("size-4 animate-spin", className)}
			{...props}
		/>
	);
}

function PageSpinner() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<Spinner className="size-8" />
		</div>
	);
}
export { Spinner, PageSpinner };
