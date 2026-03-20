import { Input } from "@/shared/ui/input";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import { CreateUserDialogContainer } from "./CreateUserDialogContainer";

type Props = {
	isUserAdmin: boolean;
	searchValue: string;
	setSearchValue: (value: string) => void;
	isRefetching: boolean;
	refetch: () => void;
};

export function MembersListToolbarContainer({
	isUserAdmin,
	searchValue,
	setSearchValue,
	isRefetching,
	refetch,
}: Props) {
	return (
		<div className="flex items-center justify-between">
			<Input
				placeholder="Search members..."
				value={searchValue}
				onChange={(event) => setSearchValue(event.target.value)}
				className="w-full sm:w-48"
			/>
			<div className="flex items-center gap-4">
				<RefreshButton
					variant="outline"
					isLoading={isRefetching}
					onClick={() => refetch()}
				/>
				{isUserAdmin && <CreateUserDialogContainer />}
			</div>
		</div>
	);
}
