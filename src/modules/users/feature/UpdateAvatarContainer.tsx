import { useCurrentUser } from "../business-logic/use-current-user";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenml/hashi/primitives/avatar";
import { UpdateAvatarDialogContainer } from "./UpdateAvatarDialogContainer";

export function UpdateAvatarContainer() {
	const { currentUserData: data } = useCurrentUser();

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
