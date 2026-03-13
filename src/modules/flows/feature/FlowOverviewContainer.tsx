import {
	PageHeader,
	PageHeaderBody,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from "@/shared/ui/PageHeader";
import { useParams } from "@tanstack/react-router";
import { useFlows } from "../business-logic/use-flows";
import { ExecutionsTableContainer } from "@/modules/executions/feature/ExecutionsTableContainer";
import { useExecutions } from "@/modules/executions/business-logic/use-executions";

export function FlowOverviewContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows_/$flowId/overview",
	});

	const { executionsData } = useExecutions();
	const { flowsData } = useFlows();
	const flow = flowsData.find((f) => f.id === flowId);

	return (
		<>
			<PageHeader>
				<PageHeaderContent>
					<PageHeaderBody>
						<PageHeaderTitle>{flow?.name}</PageHeaderTitle>
						<PageHeaderDescription>{flowId}</PageHeaderDescription>
					</PageHeaderBody>
				</PageHeaderContent>
			</PageHeader>
			<div className="container mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				<ExecutionsTableContainer executionRows={executionsData} />
			</div>
		</>
	);
}
