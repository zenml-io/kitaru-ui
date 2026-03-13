import { ExecutionIndexPrefix } from "./ExecutionIndexPrefix";

type ExecutionNameProps = {
	name: string;
	index?: number;
};

export function ExecutionName({ name, index }: ExecutionNameProps) {
	return (
		<span className="text-foreground font-semibold">
			<ExecutionIndexPrefix index={index} />
			{name}
		</span>
	);
}
