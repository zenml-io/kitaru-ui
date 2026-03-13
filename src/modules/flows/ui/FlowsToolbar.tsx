import { type FlowStatusFilter, flowStatusFilterValues } from "../domain/flow";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

export function FlowsToolbar({
	searchValue,
	statusFilter,
	onSearchValueChange,
	onStatusFilterChange,
}: {
	searchValue: string;
	statusFilter: FlowStatusFilter;
	onSearchValueChange: (value: string) => void;
	onStatusFilterChange: (value: FlowStatusFilter) => void;
}) {
	const selectedStatusValues = [statusFilter];

	return (
		<div className="border-border w-full border-b">
			<div className="container mx-auto flex w-full flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
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
		</div>
	);
}

function getNextStatusFilter(nextValue: string[]): FlowStatusFilter {
	const candidate = nextValue[0];

	if (candidate && isFlowStatusFilter(candidate)) {
		return candidate;
	}

	return "all";
}

function isFlowStatusFilter(value: string): value is FlowStatusFilter {
	return flowStatusFilterValues.some((status) => status === value);
}
