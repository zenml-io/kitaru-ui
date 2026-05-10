import { Search } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem } from "@/shared/ui/select";
import { Separator } from "@/shared/ui/separator";
import { LabeledFilterTrigger } from "../ui/LabeledFilterTrigger";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import {
	executionStatusFilterValues,
	type ExecutionStatusFilter,
} from "../domain/execution";
import {
	GLOBAL_EXECUTIONS_RANGE_VALUES,
	type GlobalExecutionsRange,
} from "../domain/global-executions-query-params";
import { formatVersion } from "@/modules/deployments/domain/deployment";

const STATUS_LABELS: Record<ExecutionStatusFilter, string> = {
	all: "All",
	running: "Running",
	failed: "Failed",
	completed: "Completed",
};

const RANGE_LABELS: Record<GlobalExecutionsRange, string> = {
	"24h": "Last 24h",
	"7d": "Last 7 days",
	"30d": "Last 30 days",
	all: "All time",
};

type FilterChange = {
	status?: ExecutionStatusFilter;
	flowId?: string;
	snapshotId?: string;
	stackId?: string;
	range?: GlobalExecutionsRange;
	search?: string;
};

type GlobalExecutionsFilterBarContainerProps = {
	status: ExecutionStatusFilter;
	flowId?: string;
	snapshotId?: string;
	stackId?: string;
	range: GlobalExecutionsRange;
	search: string;
	onChange: (next: FilterChange) => void;
};

export function GlobalExecutionsFilterBarContainer({
	status,
	flowId,
	snapshotId,
	stackId,
	range,
	search,
	onChange,
}: GlobalExecutionsFilterBarContainerProps) {
	const { data: flows } = useSuspenseQuery(flowsQueries.list({}));
	const { data: deployments } = useSuspenseQuery(deploymentsQueries.allFlows());

	const versionOptions = flowId
		? deployments.filter((d) => d.flowId === flowId)
		: deployments;

	const stacksById = new Map<string, string>();
	for (const d of deployments) {
		if (d.stackId && d.stackName) stacksById.set(d.stackId, d.stackName);
	}

	const selectedFlow = flows.find((f) => f.id === flowId);
	const selectedDeployment = deployments.find((d) => d.id === snapshotId);
	const selectedStackName = stackId ? stacksById.get(stackId) : undefined;

	const handleFlowChange = (nextFlowIdRaw: string | null) => {
		if (nextFlowIdRaw === null) return;
		const nextFlowId = nextFlowIdRaw === "all" ? undefined : nextFlowIdRaw;
		const versionStays =
			selectedDeployment &&
			(!nextFlowId || selectedDeployment.flowId === nextFlowId);
		onChange({
			flowId: nextFlowId,
			snapshotId: versionStays ? snapshotId : undefined,
		});
	};

	return (
		<div className="border-border bg-card border-b">
			<div className="container mx-auto flex flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
				<Select
					value={status}
					onValueChange={(v) => {
						if (v !== null) onChange({ status: v as ExecutionStatusFilter });
					}}
				>
					<LabeledFilterTrigger
						label="Status"
						displayValue={status === "all" ? undefined : STATUS_LABELS[status]}
					/>
					<SelectContent>
						{executionStatusFilterValues.map((s) => (
							<SelectItem key={s} value={s}>
								{STATUS_LABELS[s]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={flowId ?? "all"} onValueChange={handleFlowChange}>
					<LabeledFilterTrigger
						label="Flow"
						displayValue={selectedFlow?.name}
					/>
					<SelectContent>
						<SelectItem value="all">All flows</SelectItem>
						{flows.map((f) => (
							<SelectItem key={f.id} value={f.id}>
								{f.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={snapshotId ?? "all"}
					onValueChange={(v) => {
						if (v !== null) {
							onChange({ snapshotId: v === "all" ? undefined : v });
						}
					}}
				>
					<LabeledFilterTrigger
						label="Version"
						displayValue={
							selectedDeployment
								? formatVersion(selectedDeployment.version)
								: undefined
						}
					/>
					<SelectContent>
						<SelectItem value="all">All versions</SelectItem>
						{versionOptions.map((d) => (
							<SelectItem key={d.id} value={d.id}>
								<span className="font-mono">{formatVersion(d.version)}</span>
								{!flowId && (
									<span className="text-muted-foreground ml-1.5 text-xs">
										{d.flowName}
									</span>
								)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={stackId ?? "all"}
					onValueChange={(v) => {
						if (v !== null) {
							onChange({ stackId: v === "all" ? undefined : v });
						}
					}}
				>
					<LabeledFilterTrigger
						label="Stack"
						displayValue={selectedStackName}
					/>
					<SelectContent>
						<SelectItem value="all">All stacks</SelectItem>
						{Array.from(stacksById.entries()).map(([id, name]) => (
							<SelectItem key={id} value={id}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={range}
					onValueChange={(v) => {
						if (v !== null) onChange({ range: v as GlobalExecutionsRange });
					}}
				>
					<LabeledFilterTrigger
						label="Range"
						displayValue={range === "all" ? undefined : RANGE_LABELS[range]}
					/>
					<SelectContent>
						{GLOBAL_EXECUTIONS_RANGE_VALUES.map((r) => (
							<SelectItem key={r} value={r}>
								{RANGE_LABELS[r]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="relative">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
					<Input
						placeholder="Search by name…"
						value={search}
						onChange={(e) => onChange({ search: e.target.value })}
						className="h-8 w-[220px] pl-7 text-xs"
					/>
				</div>

				<div className="ml-auto flex items-center gap-2.5">
					<Separator orientation="vertical" className="h-5" />
				</div>
			</div>
		</div>
	);
}
