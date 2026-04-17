import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { RefreshButton } from "@/shared/ui/RefreshButton";

import { SecretFormDialogContainer } from "./SecretFormDialogContainer";

type Props = {
	searchValue: string;
	setSearchValue: (value: string) => void;
	isRefreshing: boolean;
	onRefresh: () => void;
};

export function SecretsListToolbarContainer({
	searchValue,
	setSearchValue,
	isRefreshing,
	onRefresh,
}: Props) {
	const [createOpen, setCreateOpen] = useState(false);

	return (
		<div className="flex items-center justify-between">
			<Input
				placeholder="Search secrets..."
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
				<Button onClick={() => setCreateOpen(true)}>
					<Plus className="size-4" />
					Add secret
				</Button>
				{createOpen && (
					<SecretFormDialogContainer
						mode="add"
						open={createOpen}
						onOpenChange={setCreateOpen}
					/>
				)}
			</div>
		</div>
	);
}
