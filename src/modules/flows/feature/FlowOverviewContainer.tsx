import { useExecutions } from "@/modules/executions/business-logic/use-executions";
import { ExecutionsTableContainer } from "@/modules/executions/feature/ExecutionsTableContainer";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import type { StatProps } from "@/modules/flows/ui/Stat";
import { Stats } from "@/modules/flows/ui/Stats";
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderBody,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from "@/shared/ui/PageHeader";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import {
	TableToolbarContent,
	TableToolbarRoot,
} from "@/shared/ui/TableToolbar";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export function FlowOverviewContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});

	const { executionsData, refetch } = useExecutions(flowId, {
		refetchInterval: 5000,
	});
	const { flowData } = useFlow(flowId);
	const { mutate: refreshExecutions, isPending: isManualRefreshPending } =
		useMutation({
			mutationFn: async () => {
				await refetch();
			},
		});

	const stats: StatProps[] = [
		{ label: "Executions", value: executionsData.length },
	];

	return (
		<>
			<PageHeader>
				<PageHeaderContent>
					<PageHeaderBody>
						<PageHeaderTitle>{flowData?.name}</PageHeaderTitle>
						<PageHeaderDescription>{flowId}</PageHeaderDescription>
					</PageHeaderBody>
					<PageHeaderActions>
						<Stats stats={stats} />
					</PageHeaderActions>
				</PageHeaderContent>
			</PageHeader>
			<TableToolbarRoot>
				<TableToolbarContent className="justify-end">
					<RefreshButton
						variant="outline"
						isLoading={isManualRefreshPending}
						onClick={() => refreshExecutions()}
					></RefreshButton>
				</TableToolbarContent>
			</TableToolbarRoot>
			<div className="container mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				<ExecutionsTableContainer
					executionRows={executionsData}
					flowId={flowId}
				/>
			</div>
		</>
	);
}
