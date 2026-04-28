import { useNavigate, useParams, useRouterState } from "@tanstack/react-router";

import { FlowInvokeActionsContainer } from "@/modules/deployments/feature/FlowInvokeActionsContainer";
import {
	type FlowTab,
	flowTabLabels,
	flowTabs,
} from "@/modules/flows/domain/flow";
import { ContextBar } from "@/shared/ui/ContextBar";

export function FlowContextBarContainer() {
	const { flowId, version } = useParams({
		from: "/_private/_navbar/flows/$flowId/v/$version",
	});
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	const activeTab: FlowTab = pathname.endsWith("/memory")
		? "memory"
		: /\/executions(\/|$)/.test(pathname)
			? "executions"
			: "overview";

	const navigateToTab = (tab: FlowTab) => {
		if (tab === "memory") {
			navigate({
				to: "/flows/$flowId/v/$version/memory",
				params: { flowId, version },
			});
		} else if (tab === "executions") {
			navigate({
				to: "/flows/$flowId/v/$version/executions",
				params: { flowId, version },
			});
		} else {
			navigate({
				to: "/flows/$flowId/v/$version/overview",
				params: { flowId, version },
			});
		}
	};

	const tabs = flowTabs.map((value) => ({
		value,
		label: flowTabLabels[value],
	}));

	return (
		<ContextBar
			tabs={tabs}
			activeTab={activeTab}
			onTabChange={(value) => navigateToTab(value as FlowTab)}
			actions={<FlowInvokeActionsContainer />}
		/>
	);
}
