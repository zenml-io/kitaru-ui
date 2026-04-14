import type { User } from "@/modules/users/domain/users";
import { StatusDot, type StatusDotVariant } from "../StatusDot";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
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

function StatusRenderer({ status = "unknown" }: { status?: StatusDotVariant }) {
	return (
		<div className="flex items-center gap-2">
			<StatusDot status={status} showTooltip={false} />
			<span className="text-foreground text-sm capitalize">{status}</span>
		</div>
	);
}

function UserRenderer({ name, avatarUrl }: Pick<User, "name" | "avatarUrl">) {
	if (!name) return <TextRenderer>-</TextRenderer>;

	const initials = name.slice(0, 2).toUpperCase();

	return (
		<div className="flex items-center gap-2">
			<Avatar size="sm">
				<AvatarImage src={avatarUrl} alt={name} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
			<span className="text-foreground text-sm">{name}</span>
		</div>
	);
}

export { TextRenderer, MetricValueRenderer, StatusRenderer, UserRenderer };
