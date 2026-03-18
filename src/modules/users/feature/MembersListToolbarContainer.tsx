import { Input } from "@/shared/ui/input";
import { CreateUserDialogContainer } from "./CreateUserDialogContainer";

type Props = {
	isUserAdmin: boolean;
	searchValue: string;
	setSearchValue: (value: string) => void;
};

export function MembersListToolbarContainer({
	isUserAdmin,
	searchValue,
	setSearchValue,
}: Props) {
	return (
		<div className="flex items-center justify-between">
			<Input
				placeholder="Search members..."
				value={searchValue}
				onChange={(event) => setSearchValue(event.target.value)}
				className="w-full sm:w-48"
			/>
			{isUserAdmin && <CreateUserDialogContainer />}
		</div>
	);
}
