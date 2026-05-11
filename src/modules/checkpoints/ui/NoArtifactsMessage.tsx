export function NoArtifactsMessage() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-1 p-4 text-center">
			<p className="text-foreground text-xs font-medium">
				No checkpoint artifacts to show here.
			</p>
			<p className="text-muted-foreground text-xs">No artifacts available.</p>
		</div>
	);
}
