import { useNavigate, useParams } from "@tanstack/react-router";

import { FlowInvokeActionsContainer } from "@/modules/deployments/feature/FlowInvokeActionsContainer";
import { flowTabLabels, flowTabs } from "@/modules/flows/domain/flow";
import { ContextBar } from "@/shared/ui/ContextBar";

const TAB_ROUTE_ID =
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/$tab" as const;

export function FlowContextBarContainer() {
	const { flowId, version, tab } = useParams({ from: TAB_ROUTE_ID });
	const navigate = useNavigate();

	const tabs = flowTabs.map((value) => ({
		value,
		label: flowTabLabels[value],
	}));

	return (
		<ContextBar
			tabs={tabs}
			activeTab={tab}
			onTabChange={(next) =>
				navigate({
					to: "/flows/$flowId/v/$version/$tab",
					params: { flowId, version, tab: next },
				})
			}
			actions={<FlowInvokeActionsContainer />}
		/>
	);
}
