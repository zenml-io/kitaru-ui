import { useNavigate, useParams } from "@tanstack/react-router";

import { FlowInvokeActionsContainer } from "@/modules/deployments/feature/FlowInvokeActionsContainer";
import {
	type FlowTab,
	flowTabLabels,
	flowTabs,
} from "@/modules/flows/domain/flow";
import { ContextBar } from "@/shared/ui/ContextBar";

export function FlowContextBarContainer() {
	const { flowId, tab } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});
	const navigate = useNavigate();

	const navigateToTab = (tab: FlowTab) => {
		navigate({
			to: "/flows/$flowId/$tab",
			params: { flowId, tab },
			search: (prev) => prev,
		});
	};

	const tabs = flowTabs.map((value) => ({
		value,
		label: flowTabLabels[value],
	}));

	return (
		<ContextBar
			tabs={tabs}
			activeTab={tab}
			onTabChange={(value) => navigateToTab(value as FlowTab)}
			actions={<FlowInvokeActionsContainer />}
		/>
	);
}
