import { formatExecutionIndex } from "../util/execution";

type ExecutionIndexPrefixProps = {
	index?: number;
};

export function ExecutionIndexPrefix({ index }: ExecutionIndexPrefixProps) {
	if (index === undefined) return null;

	return (
		<span className="text-secondary-foreground">
			#{formatExecutionIndex(index)}-
		</span>
	);
}
