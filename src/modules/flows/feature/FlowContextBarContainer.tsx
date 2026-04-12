import { useNavigate, useParams } from "@tanstack/react-router";

import { ContextBar } from "@/shared/ui/ContextBar";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import {
	type FlowTab,
	flowTabLabels,
	flowTabs,
} from "@/modules/flows/domain/flow";

export function FlowContextBarContainer() {
	const { flowId, tab } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});
	const { flowData } = useFlow(flowId);
	const navigate = useNavigate();

	const navigateToTab = (tab: FlowTab) => {
		navigate({ to: "/flows/$flowId/$tab", params: { flowId, tab } });
	};

	const tabs = flowTabs.map((value) => ({
		value,
		label: flowTabLabels[value],
	}));

	const metadata = [
		{ label: "ID", value: flowData.id },
		...(flowData.createdAt
			? [
					{
						label: "Created",
						value: flowData.createdAt.toLocaleDateString(),
					},
				]
			: []),
	];

	return (
		<ContextBar
			tabs={tabs}
			activeTab={tab}
			onTabChange={(value) => navigateToTab(value as FlowTab)}
			metadata={metadata}
		/>
	);
}
