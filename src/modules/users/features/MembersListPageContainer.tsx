import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { MembersTableContainer } from "./MembersTableContainer";
export function MembersListPageContainer() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Members</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<MembersTableContainer />
			</CardContent>
		</Card>
	);
}
