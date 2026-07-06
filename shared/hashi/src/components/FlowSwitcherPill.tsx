import type { ReactElement } from "react";
import { Plus } from "lucide-react";
import { DropdownMenuItem } from "@zenml/hashi/primitives/dropdown-menu";
import { StatusDot } from "@zenml/hashi/components/StatusDot";
import { SwitcherDropdownMenu } from "@zenml/hashi/components/SwitcherDropdownMenu";
import {
	SwitcherEmpty,
	SwitcherPill,
	SwitcherRow,
} from "@zenml/hashi/components/SwitcherPill";
import type { FlowStatus } from "@zenml/hashi/lib/state-styles";

interface Item {
	id: string;
	name: string;
	status: FlowStatus;
}

interface FlowStats {
	versions: number;
	execs: number;
}

interface FlowSwitcherPillViewProps {
	items: Item[];
	selected: Item;
	labelRender: ReactElement;
	className?: string;
	statsById: Record<string, FlowStats>;
	onSelectFlow: (id: string) => void;
	onCreateFlow: () => void;
}

export function FlowSwitcherPillView({
	items,
	selected,
	labelRender,
	className,
	statsById,
	onSelectFlow,
	onCreateFlow,
}: FlowSwitcherPillViewProps) {
	return (
		<SwitcherPill
			className={className}
			labelRender={labelRender}
			labelAriaLabel={`Go to flow ${selected.name}`}
			triggerAriaLabel={`Switch flow. Current: ${selected.name}`}
			label={
				<span className="max-w-30 truncate md:max-w-50">{selected.name}</span>
			}
		>
			<SwitcherDropdownMenu
				contextLabel="Flows"
				footer={
					<DropdownMenuItem
						onClick={onCreateFlow}
						className="text-muted-foreground m-1 flex items-center gap-2.5 py-1.5"
					>
						<Plus className="size-3.5" aria-hidden />
						<span className="text-sm">New flow</span>
					</DropdownMenuItem>
				}
			>
				{({ query }) => {
					const q = query.toLowerCase();
					const filtered = q
						? items.filter((item) =>
								`${item.name} ${item.id}`.toLowerCase().includes(q)
							)
						: items;
					if (filtered.length === 0) {
						return <SwitcherEmpty noun="flows" query={query} />;
					}
					return filtered.map((item) => {
						const isActive = item.id === selected.id;
						const stats = statsById[item.id] ?? { versions: 0, execs: 0 };
						const label =
							stats.versions === 0
								? "no deployments"
								: `${stats.versions} ver · ${stats.execs} exec`;
						return (
							<SwitcherRow
								key={item.id}
								active={isActive}
								onSelect={() => onSelectFlow(item.id)}
							>
								<StatusDot status={item.status} />
								<span className="text-foreground min-w-0 flex-1 truncate text-sm">
									{item.name}
								</span>
								<span className="text-2xs text-muted-foreground shrink-0 whitespace-nowrap tabular-nums">
									{label}
								</span>
							</SwitcherRow>
						);
					});
				}}
			</SwitcherDropdownMenu>
		</SwitcherPill>
	);
}
