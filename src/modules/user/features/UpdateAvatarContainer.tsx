import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueries } from "../business-logic/user-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { UpdateAvatarDialog } from "./UpdateAvatarDialog";

export function UpdateAvatarContainer() {
	const { data } = useSuspenseQuery(userQueries.currentUser());

	const avatarUrl = data.body?.avatar_url ?? undefined;
	const username = data.body?.full_name || data.name;

	return (
		<section className="flex items-center gap-4">
			<Avatar className="size-20">
				<AvatarImage src={avatarUrl} alt={username} />
				<AvatarFallback className="text-lg font-semibold">
					{username.slice(0, 2).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<UpdateAvatarDialog>Change Avatar</UpdateAvatarDialog>
		</section>
	);
}
