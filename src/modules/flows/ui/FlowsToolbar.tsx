import { Input } from "@zenml/hashi/primitives/input";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import { Separator } from "@zenml/hashi/primitives/separator";
import {
	TableToolbarContent,
	TableToolbarRoot,
} from "@/shared/ui/TableToolbar";
import { ToggleGroup, ToggleGroupItem } from "@zenml/hashi/primitives/toggle-group";
import { type FlowStatusFilter, flowStatusFilterValues } from "../domain/flow";

export function FlowsToolbar({
	searchValue,
	statusFilter,
	onSearchValueChange,
	onStatusFilterChange,
	onRefresh,
	isRefreshing,
}: {
	searchValue: string;
	statusFilter: FlowStatusFilter;
	onSearchValueChange: (value: string) => void;
	onStatusFilterChange: (value: FlowStatusFilter) => void;
	onRefresh: () => void;
	isRefreshing: boolean;
}) {
	return (
		<TableToolbarRoot>
			<TableToolbarContent className="justify-between">
				<div className="flex items-center gap-2">
					<ToggleGroup
						value={statusFilter}
						onValueChange={(nextValue) => {
							onStatusFilterChange(getNextStatusFilter(nextValue));
						}}
						variant="pill"
						size="sm"
						spacing={1}
						className="rounded-md"
						aria-label="Filter flows by status"
					>
						{flowStatusFilterValues.map((status) => (
							<ToggleGroupItem
								key={status}
								value={status}
								className="capitalize"
							>
								{status}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
					<Separator orientation="vertical" />
					<Input
						placeholder="Search flows..."
						value={searchValue}
						onChange={(event) => onSearchValueChange(event.target.value)}
						className="w-full font-mono sm:w-48"
					/>
				</div>
				<RefreshButton
					variant="outline"
					isLoading={isRefreshing}
					onClick={onRefresh}
				></RefreshButton>
			</TableToolbarContent>
		</TableToolbarRoot>
	);
}

function getNextStatusFilter(nextValue: string): FlowStatusFilter {
	if (nextValue && isFlowStatusFilter(nextValue)) {
		return nextValue;
	}

	return "all";
}

function isFlowStatusFilter(value: string): value is FlowStatusFilter {
	return flowStatusFilterValues.some((status) => status === value);
}
