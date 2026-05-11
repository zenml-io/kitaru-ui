import type { DeploymentVersion } from "@/modules/deployments/domain/deployment";
import { FlowInvokeActionsContainer } from "@/modules/deployments/feature/FlowInvokeActionsContainer";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Link, linkOptions, useMatchRoute } from "@tanstack/react-router";

type FlowContextBarContainerProps = {
	flowId: string;
	version: DeploymentVersion;
};

export function FlowContextBarContainer({
	flowId,
	version,
}: FlowContextBarContainerProps) {
	"use no memo";
	const matchRoute = useMatchRoute();
	const flowTabs = [
		{
			value: "executions",
			label: "Executions",
			link: linkOptions({
				to: "/flows/$flowId/v/$version/executions",
				params: { flowId, version },
			}),
		},
		{
			value: "invoke",
			label: "Invoke",
			link: linkOptions({
				to: "/flows/$flowId/v/$version/invoke",
				params: { flowId, version },
			}),
		},
	] as const;

	const activeTab = flowTabs.find((tab) => matchRoute(tab.link))?.value;

	return (
		<div
			data-slot="context-bar"
			className="bg-secondary border-border flex items-center justify-between border-b px-5 py-2.5"
		>
			<Tabs value={activeTab} className="flex items-center">
				<TabsList className="bg-secondary">
					{flowTabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							nativeButton={false}
							value={tab.value}
							render={<Link {...tab.link} />}
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
			<div className="flex items-center gap-3">
				<FlowInvokeActionsContainer />
			</div>
		</div>
	);
}
