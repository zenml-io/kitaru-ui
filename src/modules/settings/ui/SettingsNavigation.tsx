import { Link, useRouter } from "@tanstack/react-router";
import { User01 } from "@untitledui/icons";

export function SettingsNavigation() {
	const { buildLocation } = useRouter();

	const sidebarNav = [
		{
			label: "Profile",
			to: buildLocation({ to: "/settings/profile" }).pathname,
			icon: User01,
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
