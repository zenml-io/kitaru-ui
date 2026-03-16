import * as React from "react";
import { Link, useParams } from "@tanstack/react-router";
import { differenceInMilliseconds } from "date-fns";
import { useExecutions } from "../business-logic/use-executions";
import { useExecution } from "../business-logic/use-execution";
import { useSteps } from "../business-logic/use-steps";
import { useStepArtifacts } from "../business-logic/use-step-artifacts";
import { Button } from "@/shared/ui/button";
import { LayoutLeft, LayoutRight } from "@untitledui/icons";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarResizeHandle,
} from "@/shared/ui/sidebar";
import { StatusDot } from "@/shared/ui/StatusDot";
import { ExecutionName } from "../ui/ExecutionName";
import { formatDuration } from "@/shared/utils/time";
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderBody,
	PageHeaderContent,
} from "@/shared/ui/PageHeader";
import { Stat } from "@/modules/flows/ui/Stat";
import { SegmentedBar } from "../ui/SegmentedBar";
import { SpanTree } from "../ui/traces/span-tree";
import { TimelineAxis } from "../ui/traces/timeline-axis";
import { StepDetailPanel } from "../ui/traces/step-detail-panel";
import type { Span } from "../ui/traces/span-types";

export function ExecutionContainer() {
	const { flowId, execId } = useParams({
		from: "/_private/_navbar/flows/$flowId/execs/$execId/",
	});
	const { executionsData } = useExecutions(flowId);
	const { executionData } = useExecution(execId);
	const { stepsData } = useSteps(execId);

	const [leftOpen, setLeftOpen] = React.useState(true);
	const [rightOpen, setRightOpen] = React.useState(true);
	const [leftWidth, setLeftWidth] = React.useState(256);
	const [rightWidth, setRightWidth] = React.useState(256);
	const [selectedSpanId, setSelectedSpanId] = React.useState<string | null>(
		null
	);

	const baseline =
		executionData.startTime ?? stepsData.find((s) => s.startTime)?.startTime;

	const spans: Span[] = React.useMemo(() => {
		if (!baseline) return [];
		return stepsData
			.filter((s) => s.startTime)
			.map((s) => ({
				id: s.id,
				name: s.name,
				status: s.status,
				startMs: differenceInMilliseconds(s.startTime!, baseline),
				durationMs: s.endTime
					? differenceInMilliseconds(s.endTime, s.startTime!)
					: differenceInMilliseconds(new Date(), s.startTime!),
			}));
	}, [stepsData, baseline]);

	const totalMs = React.useMemo(() => {
		if (spans.length === 0) return 0;
		return Math.max(...spans.map((s) => s.startMs + s.durationMs));
	}, [spans]);

	const selectedSpan = spans.find((s) => s.id === selectedSpanId) ?? null;
	const { artifactsData, isLoading: isLoadingArtifacts } =
		useStepArtifacts(selectedSpanId);

	const timedSteps = stepsData.filter(
		(s): s is typeof s & { startTime: Date; endTime: Date } =>
			!!s.startTime &&
			!!s.endTime &&
			differenceInMilliseconds(s.endTime, s.startTime) > 0
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
						<SidebarMenu>
							{executionsData.map((execution) => (
								<SidebarMenuItem key={execution.id}>
									<SidebarMenuButton
										isActive={execution.id === execId}
										render={
											<Link
												to="/flows/$flowId/execs/$execId"
												params={{ flowId, execId: execution.id }}
											/>
										}
										className="flex items-center justify-between gap-2"
									>
										<ExecutionName index={execution.index} />
										<div className="flex shrink-0 items-center gap-1.5">
											<StatusDot status={execution.status ?? "unknown"} />
											<span className="text-muted-foreground text-xs capitalize">
												{execution.status ?? "unknown"}
											</span>
											{formatDuration(
												execution.startTime,
												execution.endTime
											) && (
												<span className="text-muted-foreground text-xs">
													·{" "}
													{formatDuration(
														execution.startTime,
														execution.endTime
													)}
												</span>
											)}
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
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
						<main className="flex-1 overflow-y-auto">
							<PageHeader>
								<PageHeaderContent>
									<PageHeaderBody>
										<Stat
											label="Duration"
											value={
												formatDuration(
													executionData.startTime,
													executionData.endTime
												) ?? "—"
											}
											valueColor="default"
											valueSize="sm"
										/>
									</PageHeaderBody>
									{timedSteps.length > 0 && (
										<PageHeaderActions>
											<SegmentedBar
												height="h-6"
												gap
												segments={timedSteps.map((s) => ({
													key: s.id,
													label: formatDuration(s.startTime, s.endTime),
													value: differenceInMilliseconds(
														s.endTime,
														s.startTime
													),
													className: "bg-primary",
													minWidth: "min-w-10",
												}))}
											/>
										</PageHeaderActions>
									)}
								</PageHeaderContent>
							</PageHeader>

							{spans.length > 0 && (
								<div className="flex items-center border-b px-3 py-1.5 pl-[calc(0.75rem+240px)]">
									<TimelineAxis totalMs={totalMs} />
								</div>
							)}

							<SpanTree
								spans={spans}
								totalMs={totalMs}
								selectedId={selectedSpanId}
								onSelect={(id) => {
									setSelectedSpanId(id);
									setRightOpen(true);
								}}
							/>
						</main>
					</SidebarInset>

					<Sidebar side="right" collapsible="offcanvas">
						<SidebarResizeHandle side="right" onResize={setRightWidth} />
						<SidebarContent className="bg-card">
							<SidebarGroup>
								<SidebarGroupLabel>Details</SidebarGroupLabel>
								<SidebarGroupContent>
									<StepDetailPanel
										span={selectedSpan}
										artifacts={artifactsData}
										isLoadingArtifacts={isLoadingArtifacts}
									/>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>
				</SidebarProvider>
			</SidebarInset>
		</SidebarProvider>
	);
}
