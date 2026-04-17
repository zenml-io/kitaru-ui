import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export type ExecutionTab = "execution" | "logs";

const TABS = [
	{ value: "execution", label: "Execution" },
	{ value: "logs", label: "Logs" },
] as const;

type ExecutionTabsProps = {
	activeTab: ExecutionTab;
	onTabChange: (tab: ExecutionTab) => void;
};

export function ExecutionTabs({ activeTab, onTabChange }: ExecutionTabsProps) {
	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => onTabChange(value as ExecutionTab)}
		>
			<TabsList className="bg-secondary">
				{TABS.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
