import { cn } from "@/shared/utils/styles";

export type ExecutionTab = "execution" | "logs";

const TABS = ["execution", "logs"] as const;

type ExecutionTabsProps = {
	activeTab: ExecutionTab;
	onTabChange: (tab: ExecutionTab) => void;
};

export function ExecutionTabs({ activeTab, onTabChange }: ExecutionTabsProps) {
	return (
		<div className="border-border flex shrink-0 items-center border-b">
			{TABS.map((tab) => (
				<button
					key={tab}
					type="button"
					className={cn(
						"relative cursor-pointer px-4 py-2 text-xs font-medium transition-colors",
						activeTab === tab
							? "text-foreground"
							: "text-muted-foreground hover:text-foreground"
					)}
					onClick={() => onTabChange(tab)}
				>
					<span className="capitalize">{tab}</span>
					{activeTab === tab && (
						<span className="bg-primary absolute right-4 bottom-0 left-4 h-0.5 rounded-full" />
					)}
				</button>
			))}
		</div>
	);
}
