import { Input } from "@zenml/hashi/primitives/input";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import { Separator } from "@zenml/hashi/primitives/separator";
import {
	TableToolbarContent,
	TableToolbarRoot,
} from "@/shared/ui/TableToolbar";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
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
	const selectedStatusValues = [statusFilter];

	return (
		<TableToolbarRoot>
			<TableToolbarContent className="justify-between">
				<div className="flex items-center gap-2">
					<ToggleGroup
						value={selectedStatusValues}
						onValueChange={(nextValue) => {
							onStatusFilterChange(getNextStatusFilter(nextValue));
						}}
						variant="outline"
						size="sm"
						spacing={1}
					>
						{flowStatusFilterValues.map((status) => (
							<ToggleGroupItem
								key={status}
								value={status}
								className="aria-pressed:bg-primary aria-pressed:text-primary-foreground capitalize"
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

function getNextStatusFilter(nextValue: readonly string[]): FlowStatusFilter {
	const candidate = nextValue[0];

	if (candidate && isFlowStatusFilter(candidate)) {
		return candidate;
	}

	return "all";
}

function isFlowStatusFilter(value: string): value is FlowStatusFilter {
	return flowStatusFilterValues.some((status) => status === value);
}
