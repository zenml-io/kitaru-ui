import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useState } from "react";
import { MembersListToolbar } from "../ui/MembersListToolbar";
import { MembersTableContainer } from "./MembersTableContainer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueries } from "../business-logic/user-queries";

export function MembersListPageContainer() {
	const { data: currentUser } = useSuspenseQuery(userQueries.currentUser());
	const [searchValue, setSearchValue] = useState("");

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Members</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<MembersListToolbar
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
