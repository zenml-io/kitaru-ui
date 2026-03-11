import { StatusDot } from "../StatusDot";
import { cn } from "@/shared/utils/styles";

function TextRenderer({
	variant = "default",
	children,
}: {
	variant?: "default" | "muted";
	children: React.ReactNode;
}) {
	return (
		<span
			className={cn(
				"text-foreground font-medium",
				variant === "muted" && "text-muted-foreground"
			)}
		>
			{children}
		</span>
	);
}

function MetricValueRenderer({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-muted-foreground font-mono text-xs">{children}</span>
	);
}

function StatusRenderer({
	status,
}: {
	status: "running" | "failed" | "completed";
}) {
	const statusDotVariant =
		status === "running"
			? "warning"
			: status === "failed"
				? "danger"
				: "success";

	return (
		<div className="flex items-center gap-2">
			<StatusDot variant={statusDotVariant} />
			<span className="text-foreground text-sm capitalize">{status}</span>
		</div>
	);
}

export { TextRenderer, MetricValueRenderer, StatusRenderer };
