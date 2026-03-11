import {
	type FlowStatusFilter,
	flowStatusFilterValues,
} from "../domain/flow-status";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

export type FilterOption = {
	label: string;
	value: FlowStatusFilter;
};

export function FlowsToolbar({
	statusOptions,
	searchValue,
	statusFilter,
	onSearchValueChange,
	onStatusFilterChange,
}: {
	statusOptions: FilterOption[];
	searchValue: string;
	statusFilter: FlowStatusFilter;
	onSearchValueChange: (value: string) => void;
	onStatusFilterChange: (value: FlowStatusFilter) => void;
}) {
	const selectedStatusValues = [statusFilter];

	return (
		<div className="border-border w-full border-b">
			<div className="mx-auto flex w-full max-w-[1480px] flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
				<ToggleGroup
					value={selectedStatusValues}
					onValueChange={(nextValue) => {
						onStatusFilterChange(getNextStatusFilter(nextValue));
					}}
					variant="outline"
					size="sm"
					spacing={1}
				>
					{statusOptions.map((option) => (
						<ToggleGroupItem
							key={option.value}
							value={option.value}
							className="aria-pressed:bg-primary aria-pressed:text-primary-foreground"
						>
							{option.label}
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
		</div>
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
