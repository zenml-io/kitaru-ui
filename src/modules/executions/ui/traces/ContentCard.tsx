interface ContentCardProps {
	title: string;
	children: React.ReactNode;
}

export function ContentCard({ title, children }: ContentCardProps) {
	return (
		<div className="border-border overflow-hidden rounded-lg border">
			<div className="bg-muted/50 border-border flex items-center gap-2 border-b px-4 py-2">
				<span className="text-foreground truncate text-xs font-semibold">
					{title}
				</span>
			</div>
			<div className="bg-background">{children}</div>
		</div>
	);
}
