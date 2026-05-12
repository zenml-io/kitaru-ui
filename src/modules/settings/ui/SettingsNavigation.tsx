import { Link, useRouter } from "@tanstack/react-router";
import { KeyRound, ShieldCheck, User, Users } from "lucide-react";

export function SettingsNavigation() {
	const { buildLocation } = useRouter();

	const sidebarNav = [
		{
			label: "Profile",
			to: buildLocation({ to: "/settings/profile" }).pathname,
			icon: User,
		},
		{
			label: "Members",
			to: buildLocation({ to: "/settings/members" }).pathname,
			icon: Users,
		},
		{
			label: "Secrets",
			to: buildLocation({ to: "/settings/secrets" }).pathname,
			icon: KeyRound,
		},
		{
			label: "API keys",
			to: buildLocation({ to: "/settings/api-keys" }).pathname,
			icon: ShieldCheck,
		},
	];

	return (
		<nav className="flex w-[200px] shrink-0 flex-col gap-1">
			{sidebarNav.map((item) => (
				<Link
					key={item.to}
					to={item.to}
					className="[&.active]:bg-accent [&.active]:text-foreground text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm no-underline [&.active]:font-medium"
				>
					<item.icon className="size-4" />
					{item.label}
				</Link>
			))}
		</nav>
	);
}
