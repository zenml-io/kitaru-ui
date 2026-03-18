import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { userQueries } from "../business-logic/user-queries";
import { MembersListToolbarContainer } from "./MembersListToolbarContainer";
import { MembersTableContainer } from "./MembersTableContainer";

export function MembersListPageContainer() {
	const { data: currentUser } = useSuspenseQuery(userQueries.currentUser());
	const [searchValue, setSearchValue] = useState("");

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Members</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<MembersListToolbarContainer
					isUserAdmin={currentUser.isAdmin ?? false}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
				/>
				<MembersTableContainer
					currentUserId={currentUser.id}
					searchValue={searchValue}
				/>
			</CardContent>
		</Card>
	);
}
