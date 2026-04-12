interface ContentCardProps {
	title: string;
	subtitle?: string;
	action?: React.ReactNode;
	children: React.ReactNode;
}

export function ContentCard({
	title,
	subtitle,
	action,
	children,
}: ContentCardProps) {
	return (
		<div className="border-border overflow-hidden rounded-lg border">
			<div className="bg-muted/50 border-border flex items-center gap-2 border-b px-4 py-2">
				<span className="text-foreground truncate text-xs font-semibold">
					{title}
				</span>
				{subtitle && (
					<span className="text-2xs text-muted-foreground">{subtitle}</span>
				)}
				{action && <div className="ml-auto">{action}</div>}
			</div>
			<div className="bg-background">{children}</div>
		</div>
	);
}
