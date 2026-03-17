import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { UpdateAvatarContainer } from "./UpdateAvatarContainer";
import { UpdateCurrentUserFormContainer } from "./UpdateCurrentUserFormContainer";

export function UpdateCurrentUserPageContainer() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Profile</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<UpdateAvatarContainer />
				<UpdateCurrentUserFormContainer />
			</CardContent>
		</Card>
	);
}
