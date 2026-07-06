import { useManualRefresh } from "@zenml/shared-kitaru/business-logic/use-manual-refresh";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@zenml/hashi/primitives/card";
import { useState } from "react";
import { useCurrentUser } from "../business-logic/use-current-user";
import { useUserList } from "../business-logic/use-user-list";
import { MembersTable } from "../ui/MembersTable";
import { MembersListToolbarContainer } from "./MembersListToolbarContainer";

export function MembersListPageContainer() {
	const [searchValue, setSearchValue] = useState("");
	const { currentUserData: currentUser } = useCurrentUser();
	const { userListData: data, refetch } = useUserList();
	const { refresh: refreshMembers, isPending: isManualRefreshPending } =
		useManualRefresh(refetch);

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
					isRefreshing={isManualRefreshPending}
					onRefresh={refreshMembers}
					isUserAdmin={currentUser.isAdmin ?? false}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
				/>
				<MembersTable currentUserId={currentUser.id} users={filteredMembers} />
			</CardContent>
		</Card>
	);
}
