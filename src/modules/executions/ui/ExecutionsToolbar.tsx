import {
	type ExecutionStatusFilter,
	executionStatusFilterValues,
} from "../domain/execution";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

export function ExecutionsToolbar({
	searchValue,
	statusFilter,
	onSearchValueChange,
	onStatusFilterChange,
}: {
	searchValue: string;
	statusFilter: ExecutionStatusFilter;
	onSearchValueChange: (value: string) => void;
	onStatusFilterChange: (value: ExecutionStatusFilter) => void;
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
					{executionStatusFilterValues.map((status) => (
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
					placeholder="Search executions..."
					value={searchValue}
					onChange={(event) => onSearchValueChange(event.target.value)}
					className="w-full font-mono sm:w-48"
				/>
			</div>
		</div>
	);
}

function getNextStatusFilter(
	nextValue: readonly string[]
): ExecutionStatusFilter {
	const candidate = nextValue[0];

	if (candidate && isExecutionStatusFilter(candidate)) {
		return candidate;
	}

	return "all";
}

function isExecutionStatusFilter(
	value: string
): value is ExecutionStatusFilter {
	return executionStatusFilterValues.some((status) => status === value);
}
