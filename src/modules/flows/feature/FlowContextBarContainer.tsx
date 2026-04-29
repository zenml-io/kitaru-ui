import { useMatchRoute, useNavigate, useParams } from "@tanstack/react-router";

import { FlowInvokeActionsContainer } from "@/modules/deployments/feature/FlowInvokeActionsContainer";
import {
	type FlowTab,
	flowTabLabels,
	flowTabs,
} from "@/modules/flows/domain/flow";
import { ContextBar } from "@/shared/ui/ContextBar";

const tabRoutes = {
	overview: "/flows/$flowId/v/$version/overview",
	executions: "/flows/$flowId/v/$version/executions",
	memory: "/flows/$flowId/v/$version/memory",
} as const satisfies Record<FlowTab, string>;

export function FlowContextBarContainer() {
	const { flowId, version } = useParams({
		from: "/_private/_navbar/flows/$flowId/v/$version",
	});
	const navigate = useNavigate();
	const matchRoute = useMatchRoute();

	const activeTab: FlowTab =
		flowTabs.find((tab) => matchRoute({ to: tabRoutes[tab] })) ?? "overview";

	const tabs = flowTabs.map((value) => ({
		value,
		label: flowTabLabels[value],
	}));

	return (
		<ContextBar
			tabs={tabs}
			activeTab={activeTab}
			onTabChange={(tab) =>
				navigate({ to: tabRoutes[tab], params: { flowId, version } })
			}
			actions={<FlowInvokeActionsContainer />}
		/>
	);
}
