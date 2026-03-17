import { formatExecutionIndex } from "../util/execution";

type ExecutionNameProps = {
	index: number;
};

export function ExecutionName({ index }: ExecutionNameProps) {
	return (
		<span className="text-foreground font-semibold">
			#{formatExecutionIndex(index)}
		</span>
	);
}
