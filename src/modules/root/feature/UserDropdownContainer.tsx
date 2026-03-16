import { currentUserQueries } from "@/modules/root/business-logic/current-user-queries";
import { useLogoutUser } from "@/modules/session/business-logic/use-logout-user";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { ThemeSwitcherContainer } from "./ThemeSwitcherContainer";

export function UserDropdownContainer() {
	const { data } = useSuspenseQuery(currentUserQueries.detail());
	const router = useRouter();

	const username = data.body?.full_name || data.name;

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
						size="icon"
						className="rounded-full"
						aria-label="User menu"
					>
						<Avatar className="h-7 w-7">
							<AvatarFallback className="text-xs font-semibold">
								{username.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Button>
				}
			></DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[180px]">
				<DropdownMenuItem render={<Link to="/settings/profile" />}>
					Profile
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<ThemeSwitcherContainer />
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => logoutUser()}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
