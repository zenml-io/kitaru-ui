import * as React from "react";
import { useParams } from "@tanstack/react-router";
import { useExecutions } from "../business-logic/use-executions";
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
} from "@/shared/ui/sidebar";

export function ExecutionContainer() {
	const { flowId, execId } = useParams({
		from: "/_private/_navbar/flows/$flowId/execs/$execId/",
	});
	const { executionsData } = useExecutions(flowId);

	const [leftOpen, setLeftOpen] = React.useState(true);
	const [rightOpen, setRightOpen] = React.useState(true);

	return (
		<SidebarProvider
			open={leftOpen}
			onOpenChange={setLeftOpen}
			className="min-h-0 flex-1"
		>
			<Sidebar side="left" collapsible="offcanvas">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Executions</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{executionsData.map((execution) => (
									<SidebarMenuItem key={execution.id}>
										<SidebarMenuButton isActive={execution.id === execId}>
											{execution.name}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
								{Array.from({ length: 40 }, (_, i) => (
									<SidebarMenuItem key={`dummy-left-${i}`}>
										<SidebarMenuButton>
											Dummy execution {i + 1}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>

			<SidebarInset>
				<SidebarProvider
					open={rightOpen}
					onOpenChange={setRightOpen}
					className="min-h-0 flex-1"
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
						<main className="flex-1 overflow-y-auto p-4">
							{Array.from({ length: 40 }, (_, i) => (
								<div key={i} className="border-b py-3 text-sm">
									Content item {i + 1}
								</div>
							))}
						</main>
					</SidebarInset>

					<Sidebar side="right" collapsible="offcanvas">
						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupLabel>Details</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{Array.from({ length: 40 }, (_, i) => (
											<SidebarMenuItem key={`dummy-right-${i}`}>
												<SidebarMenuButton>
													Detail item {i + 1}
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>
				</SidebarProvider>
			</SidebarInset>
		</SidebarProvider>
	);
}
