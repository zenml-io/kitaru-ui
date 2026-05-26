import { Input } from "@zenml/hashi/primitives/input";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import { CreateUserDialogContainer } from "./CreateUserDialogContainer";

type Props = {
	isUserAdmin: boolean;
	searchValue: string;
	setSearchValue: (value: string) => void;
	isRefreshing: boolean;
	onRefresh: () => void;
};

export function MembersListToolbarContainer({
	isUserAdmin,
	searchValue,
	setSearchValue,
	isRefreshing,
	onRefresh,
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
					isLoading={isRefreshing}
					onClick={onRefresh}
				/>
				{isUserAdmin && <CreateUserDialogContainer />}
			</div>
		</div>
	);
}
