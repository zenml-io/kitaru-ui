import type { Stack } from "@/modules/stacks/domain/stack";
import type { GroupedStackComponents } from "@/modules/stacks/business-logic/group-stack-components";
import { Collapsible, CollapsibleContent } from "@zenml/hashi/primitives/collapsible";
import { ConfigurationSectionHeader } from "./ConfigurationSectionHeader";
import {
	SingleStackComponentCard,
	StackComponentGroupCard,
} from "./StackComponentCard";

type StackSectionProps = {
	stack: Stack;
	groupedComponents: GroupedStackComponents[];
};

export function StackSection({ stack, groupedComponents }: StackSectionProps) {
	return (
		<Collapsible defaultOpen>
			<ConfigurationSectionHeader label="Stack" />
			<CollapsibleContent className="space-y-3 px-4 pb-4">
				<div className="flex items-center gap-2 pb-1">
					<div className="bg-primary/20 text-primary flex size-6 items-center justify-center rounded-md text-xs font-semibold">
						{stack.name.charAt(0).toUpperCase()}
					</div>
					<span className="text-foreground font-mono text-xs font-semibold">
						{stack.name}
					</span>
				</div>
				{groupedComponents.map((entry) =>
					entry.variant === "group" ? (
						<StackComponentGroupCard
							key={entry.type}
							type={entry.type}
							components={entry.components}
						/>
					) : (
						<SingleStackComponentCard
							key={entry.component.id}
							type={entry.type}
							component={entry.component}
						/>
					)
				)}
			</CollapsibleContent>
		</Collapsible>
	);
}
