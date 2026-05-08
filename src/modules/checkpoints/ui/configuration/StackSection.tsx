import { useState } from "react";
import type { Stack } from "@/modules/stacks/domain/stack";
import { ConfigurationSectionHeader } from "./ConfigurationSectionHeader";
import { groupStackComponents } from "@/modules/stacks/business-logic/group-stack-components";
import {
	SingleStackComponentCard,
	StackComponentGroupCard,
} from "./StackComponentCard";

type StackSectionProps = {
	stack: Stack;
};

export function StackSection({ stack }: StackSectionProps) {
	const [expanded, setExpanded] = useState(true);
	const grouped = groupStackComponents(stack.components);
	return (
		<div>
			<ConfigurationSectionHeader
				label="Stack"
				expanded={expanded}
				onToggle={() => setExpanded((v) => !v)}
			/>
			{expanded && (
				<div className="space-y-3 px-4 pb-4">
					<div className="flex items-center gap-2 pb-1">
						<div className="bg-primary/20 text-primary flex size-6 items-center justify-center rounded-md text-xs font-semibold">
							{stack.name.charAt(0).toUpperCase()}
						</div>
						<span className="text-foreground font-mono text-xs font-semibold">
							{stack.name}
						</span>
					</div>
					{grouped.map((entry) =>
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
				</div>
			)}
		</div>
	);
}
