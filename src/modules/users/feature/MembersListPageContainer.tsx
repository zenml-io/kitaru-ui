import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { userQueries } from "../business-logic/user-queries";
import { MembersTable } from "../ui/MembersTable";
import { MembersListToolbarContainer } from "./MembersListToolbarContainer";

export function MembersListPageContainer() {
	const [searchValue, setSearchValue] = useState("");
	const { data: currentUser } = useSuspenseQuery(userQueries.currentUser());
	const { data, isRefetching, refetch } = useSuspenseQuery(userQueries.list());

	const filteredMembers = data.items.filter((member) =>
		member.name.toLowerCase().includes(searchValue.toLowerCase())
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Members</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<MembersListToolbarContainer
					isRefetching={isRefetching}
					refetch={refetch}
					isUserAdmin={currentUser.isAdmin ?? false}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
				/>
				<MembersTable currentUserId={currentUser.id} users={filteredMembers} />
			</CardContent>
		</Card>
	);
}
