import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { UpdateAvatarContainer } from "./UpdateAvatarContainer";
import { UpdateCurrentUserForm } from "./UpdateCurrentUserFormContainer";

export function UpdateCurrentUserPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Profile</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<UpdateAvatarContainer />
				<UpdateCurrentUserForm />
			</CardContent>
		</Card>
	);
}
