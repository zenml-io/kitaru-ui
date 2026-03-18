import * as React from "react";
import { useParams } from "@tanstack/react-router";
import { useExecutions } from "../business-logic/use-executions";
import { useExecution } from "../business-logic/use-execution";
import { useCheckpoints } from "@/modules/checkpoints/business-logic/use-checkpoints";
import { Button } from "@/shared/ui/button";
import { LayoutLeft, LayoutRight } from "@untitledui/icons";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarInset,
	SidebarProvider,
	SidebarResizeHandle,
} from "@/shared/ui/sidebar";
import { ExecutionsList } from "../ui/ExecutionsList";
import { ExecutionDetails } from "../ui/ExecutionDetails";
import { CheckpointDetailPanel } from "@/modules/checkpoints/ui/CheckpointDetailPanel";

export function ExecutionContainer() {
	const { flowId, executionId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId",
	});
	const { executionsData } = useExecutions(flowId);
	const { executionData } = useExecution(executionId);
	const { checkpointsData } = useCheckpoints(executionId);

	const [leftOpen, setLeftOpen] = React.useState(true);
	const [rightOpen, setRightOpen] = React.useState(true);
	const [leftWidth, setLeftWidth] = React.useState(256);
	const [rightWidth, setRightWidth] = React.useState(256);
	const [selectedCheckpointId, setSelectedCheckpointId] = React.useState<
		string | undefined
	>();

	const selectedCheckpoint = checkpointsData?.find(
		(c) => c.id === selectedCheckpointId
	);

	return (
		<SidebarProvider
			open={leftOpen}
			onOpenChange={setLeftOpen}
			className="min-h-0 flex-1"
			// TODO: remove type assertion
			style={{ "--sidebar-width": `${leftWidth}px` } as React.CSSProperties}
		>
			<Sidebar side="left" collapsible="offcanvas">
				<SidebarResizeHandle side="left" onResize={setLeftWidth} />
				<SidebarContent className="bg-card">
					<SidebarGroupLabel>Executions</SidebarGroupLabel>
					<SidebarGroupContent>
						<ExecutionsList
							executions={executionsData}
							flowId={flowId}
							activeexecutionId={executionId}
						/>
					</SidebarGroupContent>
				</SidebarContent>
			</Sidebar>

			<SidebarInset>
				<SidebarProvider
					open={rightOpen}
					onOpenChange={setRightOpen}
					className="min-h-0 flex-1"
					// TODO: remove type assertion
					style={
						{ "--sidebar-width": `${rightWidth}px` } as React.CSSProperties
					}
				>
					<SidebarInset className="min-h-0">
						<header className="flex shrink-0 items-center justify-between border-b px-3 py-2">
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setLeftOpen((o) => !o)}
							>
								<LayoutLeft />
								<span className="sr-only">Toggle left sidebar</span>
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setRightOpen((o) => !o)}
							>
								<LayoutRight />
								<span className="sr-only">Toggle right sidebar</span>
							</Button>
						</header>
						<ExecutionDetails
							execution={executionData}
							checkpoints={checkpointsData}
							selectedCheckpointId={selectedCheckpointId}
							onSelectCheckpoint={(id) => {
								setSelectedCheckpointId(id);
								setRightOpen(true);
							}}
						/>
					</SidebarInset>

					<Sidebar side="right" collapsible="offcanvas">
						<SidebarResizeHandle side="right" onResize={setRightWidth} />
						<SidebarContent className="bg-card">
							<SidebarGroup>
								<SidebarGroupLabel>Details</SidebarGroupLabel>
								<SidebarGroupContent>
									<React.Suspense>
										<CheckpointDetailPanel checkpoint={selectedCheckpoint} />
									</React.Suspense>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>
				</SidebarProvider>
			</SidebarInset>
		</SidebarProvider>
	);
}
