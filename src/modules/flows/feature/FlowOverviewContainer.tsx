import {
	PageHeader,
	PageHeaderActions,
	PageHeaderBody,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from "@/shared/ui/PageHeader";
import { useParams } from "@tanstack/react-router";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import { ExecutionsTableContainer } from "@/modules/executions/feature/ExecutionsTableContainer";
import { useExecutions } from "@/modules/executions/business-logic/use-executions";
import { Stats } from "@/modules/flows/ui/Stats";
import type { StatProps } from "@/modules/flows/ui/Stat";

export function FlowOverviewContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});

	const { executionsData } = useExecutions(flowId);
	const { flowData } = useFlow(flowId);

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
			<div className="container mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				<ExecutionsTableContainer executionRows={executionsData} />
			</div>
		</>
	);
}
