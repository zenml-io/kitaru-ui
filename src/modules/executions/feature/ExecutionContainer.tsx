import { useParams } from "@tanstack/react-router";
import { useExecutions } from "../business-logic/use-executions";

export function ExecutionContainer() {
	const { flowId, execId } = useParams({
		from: "/_private/_navbar/flows/$flowId/execs/$execId/",
	});
	const { executionsData } = useExecutions(flowId);

	return (
		<div className="container mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
			<p className="text-muted-foreground text-sm">
				Execution:{" "}
				{executionsData.find((execution) => execution.id === execId)?.name}
			</p>
			{executionsData.map((execution) => (
				<div key={execution.id}>
					<p className="text-muted-foreground text-sm">{execution.name}</p>
				</div>
			))}
		</div>
	);
}
