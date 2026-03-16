import { Link } from "@tanstack/react-router";

export function SettingsNavigation() {
	return (
		<ul className="flex w-full max-w-[200px] flex-col gap-2">
			<li>
				<Link
					className="[&.active]:bg-accent block px-2 py-1"
					to="/settings/profile"
				>
					Profile
				</Link>
			</li>
		</ul>
	);
}
