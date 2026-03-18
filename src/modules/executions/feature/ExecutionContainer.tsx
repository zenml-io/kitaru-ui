import * as React from "react";
import { useParams } from "@tanstack/react-router";
import { useGroupRef } from "react-resizable-panels";
import { useExecutions } from "../business-logic/use-executions";
import { useExecution } from "../business-logic/use-execution";
import { useCheckpoints } from "@/modules/checkpoints/business-logic/use-checkpoints";
import { Button } from "@/shared/ui/button";
import { LayoutLeft, LayoutRight } from "@untitledui/icons";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/shared/ui/resizable";
import { ExecutionsList } from "../ui/ExecutionsList";
import { ExecutionDetails } from "../ui/ExecutionDetails";
import { CheckpointDetailPanel } from "@/modules/checkpoints/ui/CheckpointDetailPanel";

const PANEL_SIZES = {
	left: { default: 20, min: 10 },
	center: { default: 60, min: 30 },
	right: { default: 20, min: 10 },
} as const;

export function ExecutionContainer() {
	const { flowId, executionId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId/",
	});
	const { executionsData } = useExecutions(flowId);
	const { executionData } = useExecution(executionId);
	const { checkpointsData } = useCheckpoints(executionId);

	const [selectedCheckpointId, setSelectedCheckpointId] = React.useState<
		string | undefined
	>();

	const groupRef = useGroupRef();
	const leftPanelId = "left";
	const rightPanelId = "right";

	const selectedCheckpoint = checkpointsData?.find(
		(c) => c.id === selectedCheckpointId
	);

	function toggleLeft() {
		const layout = groupRef.current?.getLayout();
		if (layout?.[leftPanelId] === 0) {
			groupRef.current?.setLayout({
				...layout,
				[leftPanelId]: PANEL_SIZES.left.default,
			});
		} else {
			groupRef.current?.setLayout({ ...layout, [leftPanelId]: 0 });
		}
	}

	function toggleRight() {
		const layout = groupRef.current?.getLayout();
		if (layout?.[rightPanelId] === 0) {
			groupRef.current?.setLayout({
				...layout,
				[rightPanelId]: PANEL_SIZES.right.default,
			});
		} else {
			groupRef.current?.setLayout({ ...layout, [rightPanelId]: 0 });
		}
	}

	return (
		<ResizablePanelGroup
			orientation="horizontal"
			className="min-h-0 flex-1"
			groupRef={groupRef}
		>
			<ResizablePanel
				id={leftPanelId}
				defaultSize={PANEL_SIZES.left.default}
				minSize={PANEL_SIZES.left.min}
				collapsible
				collapsedSize={0}
				className="bg-card overflow-y-auto"
			>
				<ExecutionsList
					executions={executionsData}
					flowId={flowId}
					activeexecutionId={executionId}
				/>
			</ResizablePanel>

			<ResizableHandle />

			<ResizablePanel
				defaultSize={PANEL_SIZES.center.default}
				minSize={PANEL_SIZES.center.min}
			>
				<div className="flex h-full flex-col">
					<header className="flex shrink-0 items-center justify-between border-b px-3 py-2">
						<Button variant="ghost" size="icon-sm" onClick={toggleLeft}>
							<LayoutLeft />
							<span className="sr-only">Toggle left panel</span>
						</Button>
						<Button variant="ghost" size="icon-sm" onClick={toggleRight}>
							<LayoutRight />
							<span className="sr-only">Toggle right panel</span>
						</Button>
					</header>
					<ExecutionDetails
						execution={executionData}
						checkpoints={checkpointsData}
						selectedCheckpointId={selectedCheckpointId}
						onSelectCheckpoint={(id) => {
							setSelectedCheckpointId(id);
							const layout = groupRef.current?.getLayout();
							if (layout?.[rightPanelId] === 0) {
								groupRef.current?.setLayout({
									...layout,
									[rightPanelId]: PANEL_SIZES.right.default,
								});
							}
						}}
					/>
				</div>
			</ResizablePanel>

			<ResizableHandle />

			<ResizablePanel
				id={rightPanelId}
				defaultSize={PANEL_SIZES.right.default}
				minSize={PANEL_SIZES.right.min}
				collapsible
				collapsedSize={0}
				className="bg-card"
			>
				<div className="flex h-full flex-col">
					<div className="text-muted-foreground px-3 py-2 text-xs font-semibold">
						Details
					</div>
					<div className="min-h-0 flex-1 overflow-y-auto">
						<React.Suspense>
							<CheckpointDetailPanel checkpoint={selectedCheckpoint} />
						</React.Suspense>
					</div>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
