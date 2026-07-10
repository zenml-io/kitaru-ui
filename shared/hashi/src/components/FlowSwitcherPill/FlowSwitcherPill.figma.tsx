import figma from "@figma/code-connect";

import { FlowSwitcherPillView } from "./FlowSwitcherPill";

// FlowSwitcherPill has no separate Figma set — it is the context=flow family
// of the shared SwitcherRow set (StatusDot + name + version/exec counter).
figma.connect(
	FlowSwitcherPillView,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-507",
	{
		variant: { context: "flow" },
		example: () => (
			<FlowSwitcherPillView
				items={[
					{ id: "flow-1", name: "customer-churn-prediction", status: "active" },
				]}
				selected={{
					id: "flow-1",
					name: "customer-churn-prediction",
					status: "active",
				}}
				labelRender={<a href="#" />}
				statsById={{ "flow-1": { versions: 3, execs: 12 } }}
				onSelectFlow={() => {}}
				onCreateFlow={() => {}}
			/>
		),
	}
);
