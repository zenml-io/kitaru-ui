import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueries } from "../business-logic/user-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { UpdateAvatarDialogContainer } from "./UpdateAvatarDialogContainer";

export function UpdateAvatarContainer() {
	const { data } = useSuspenseQuery(userQueries.currentUser());

	const avatarUrl = data.avatarUrl ?? undefined;
	const resolvedName = data.resolvedName;

	return (
		<section className="flex items-center gap-4">
			<Avatar className="size-20">
				<AvatarImage src={avatarUrl} alt={resolvedName} />
				<AvatarFallback className="text-lg font-semibold">
					{resolvedName.slice(0, 2).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<UpdateAvatarDialogContainer>Change Avatar</UpdateAvatarDialogContainer>
		</section>
	);
}
