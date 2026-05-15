import { cn } from "@/shared/utils/styles";

const TABS = [
	"logs",
	"checkpoint",
	"configuration",
	"code",
	"artifacts",
] as const;

export type PanelTab = (typeof TABS)[number];

interface CheckpointDetailPanelTabsProps {
	activeTab: PanelTab;
	onTabChange: (tab: PanelTab) => void;
}

export function CheckpointDetailPanelTabs({
	activeTab,
	onTabChange,
}: CheckpointDetailPanelTabsProps) {
	return (
		<div className="flex shrink-0 items-center">
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
