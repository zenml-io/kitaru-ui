export function CheckpointDetailPanelConfigurationEmpty() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-1 p-4 text-center">
			<p className="text-foreground text-xs font-medium">
				No configuration available.
			</p>
			<p className="text-muted-foreground text-xs">
				This checkpoint was not associated with a stack or build.
			</p>
		</div>
	);
}
