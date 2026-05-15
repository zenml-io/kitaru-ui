import { useSuspenseQuery } from "@tanstack/react-query";
import { groupStackComponents } from "@/modules/stacks/business-logic/group-stack-components";
import { stacksQueries } from "@/modules/stacks/business-logic/stacks-queries";
import { selectVisibleStackComponents } from "../business-logic/select-visible-stack-components";
import { StackSection } from "../ui/configuration/StackSection";

type Props = {
	stackId: string;
	checkpointStepOperator?: boolean | string;
	checkpointExperimentTracker?: boolean | string;
};

export function CheckpointStackSectionContainer({
	stackId,
	checkpointStepOperator,
	checkpointExperimentTracker,
}: Props) {
	const { data: stack } = useSuspenseQuery(stacksQueries.detail(stackId));
	const visibleComponents = selectVisibleStackComponents(stack, {
		stepOperator: checkpointStepOperator,
		experimentTracker: checkpointExperimentTracker,
	});
	const groupedComponents = groupStackComponents(visibleComponents);
	return <StackSection stack={stack} groupedComponents={groupedComponents} />;
}
