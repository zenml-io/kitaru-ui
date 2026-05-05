import { useSuspenseQuery } from "@tanstack/react-query";
import { stacksQueries } from "@/modules/stacks/business-logic/stacks-queries";
import { StackSection } from "../ui/configuration/StackSection";

type Props = {
	stackId: string;
};

export function CheckpointStackSectionContainer({ stackId }: Props) {
	const { data: stack } = useSuspenseQuery(stacksQueries.detail(stackId));
	return <StackSection stack={stack} />;
}
