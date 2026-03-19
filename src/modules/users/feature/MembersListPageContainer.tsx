import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { userQueries } from "../business-logic/user-queries";
import { MembersListToolbarContainer } from "./MembersListToolbarContainer";
import { MembersTableContainer } from "./MembersTableContainer";

export function MembersListPageContainer() {
	const [searchValue, setSearchValue] = useState("");
	const { data: currentUser } = useSuspenseQuery(userQueries.currentUser());
	const { data, isRefetching, refetch } = useSuspenseQuery(userQueries.list());

	const filteredMembers = useMemo(
		() =>
			data.items.filter((member) =>
				member.name.toLowerCase().includes(searchValue.toLowerCase())
			),
		[data.items, searchValue]
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
				<MembersTableContainer
					currentUserId={currentUser.id}
					users={filteredMembers}
				/>
			</CardContent>
		</Card>
	);
}
