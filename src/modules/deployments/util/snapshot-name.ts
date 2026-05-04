export function buildSnapshotName(flowName: string, version: number): string {
	return `kitaru::${flowName}::v${version}`;
}
