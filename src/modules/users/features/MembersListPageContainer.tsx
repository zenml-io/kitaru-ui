import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { MembersTableContainer } from "./MembersTableContainer";

export function MembersListPageContainer() {
	const [searchValue, setSearchValue] = useState("");

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Members</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<Input
					placeholder="Search members..."
					value={searchValue}
					onChange={(event) => setSearchValue(event.target.value)}
					className="w-full sm:w-48"
				/>
				<MembersTableContainer searchValue={searchValue} />
			</CardContent>
		</Card>
	);
}
