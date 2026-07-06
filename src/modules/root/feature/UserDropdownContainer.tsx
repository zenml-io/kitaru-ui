import { useLogoutUser } from "@/modules/session/business-logic/use-logout-user";
import { useCurrentUser } from "@/modules/users/business-logic/use-current-user";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenml/hashi/primitives/avatar";
import { Button } from "@zenml/hashi/primitives/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zenml/hashi/primitives/dropdown-menu";
import { Link, useRouter } from "@tanstack/react-router";
import { LoginCommandContainer } from "./LoginCommandContainer";
import { ThemeSwitcherContainer } from "./ThemeSwitcherContainer";

export function UserDropdownContainer() {
	const { currentUserData: data } = useCurrentUser();
	const router = useRouter();

	const resolvedName = data.resolvedName;
	const avatarUrl = data.avatarUrl ?? undefined;

	const { logoutUser } = useLogoutUser({
		onSuccess: () => {
			router.navigate({ to: "/login", replace: true });
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon-sm"
						className="rounded-full"
						aria-label="User menu"
					>
						<Avatar className="size-7">
							<AvatarImage src={avatarUrl} alt={resolvedName} />
							<AvatarFallback className="text-xs font-semibold">
								{resolvedName.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Button>
				}
			></DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[220px]">
				<DropdownMenuItem render={<Link to="/settings/profile" />}>
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link to="/settings/members" />}>
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<ThemeSwitcherContainer />
				<DropdownMenuSeparator />
				<LoginCommandContainer />
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => logoutUser()}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
