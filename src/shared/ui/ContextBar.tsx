import * as React from "react";

import { cn } from "@/shared/utils/styles";
import { Separator } from "@zenml/hashi/primitives/separator";
import { Tabs, TabsList, TabsTrigger } from "@zenml/hashi/primitives/tabs";

export type ContextBarTab<T extends string = string> = {
	label: string;
	value: T;
};

export type ContextBarMetadataItem = {
	label: string;
	value: React.ReactNode;
};

type ContextBarProps<T extends string> = {
	tabs?: ContextBarTab<T>[];
	activeTab?: T;
	onTabChange?: (value: T) => void;
	metadata?: ContextBarMetadataItem[];
	actions?: React.ReactNode;
	className?: string;
};

function ContextBar<T extends string>({
	tabs,
	activeTab,
	onTabChange,
	metadata,
	actions,
	className,
}: ContextBarProps<T>) {
	const hasTabs = tabs && tabs.length > 0 && onTabChange;
	const hasMetadata = metadata && metadata.length > 0;

	if (!hasTabs && !hasMetadata && !actions) return null;

	return (
		<div
			data-slot="context-bar"
			className={cn(
				"bg-secondary border-border flex items-center justify-between border-b px-5 py-2.5",
				className
			)}
		>
			<div className="flex items-center">
				{hasTabs && (
					<Tabs
						value={activeTab}
						onValueChange={(value) => {
							const next = tabs.find((t) => t.value === value);
							if (next) onTabChange(next.value);
						}}
					>
						<TabsList className="bg-secondary">
							{tabs.map((t) => (
								<TabsTrigger key={t.value} value={t.value}>
									{t.label}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				)}
			</div>

			<div className="flex items-center gap-3">
				{hasMetadata && (
					<>
						{metadata.map((m, i) => (
							<span key={m.label} className="flex items-center gap-3">
								<span className="font-mono text-sm tabular-nums">
									<span className="text-muted-foreground mr-1.5 text-xs font-semibold tracking-wider uppercase">
										{m.label}
									</span>
									<span className="text-foreground">{m.value}</span>
								</span>
								{i < metadata.length - 1 && (
									<Separator orientation="vertical" className="h-4" />
								)}
							</span>
						))}
						{actions && <Separator orientation="vertical" className="h-4" />}
					</>
				)}
				{actions}
			</div>
		</div>
	);
}

export { ContextBar };
