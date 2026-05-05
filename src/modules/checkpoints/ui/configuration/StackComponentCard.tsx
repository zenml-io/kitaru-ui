import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type {
	StackComponent,
	StackComponentType,
} from "@/modules/stacks/domain/stack";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/styles";

const TYPE_LABEL: Record<StackComponentType, string> = {
	alerter: "Alerter",
	annotator: "Annotator",
	artifact_store: "Artifact Store",
	container_registry: "Container Registry",
	data_validator: "Data Validator",
	deployer: "Deployer",
	experiment_tracker: "Experiment Tracker",
	feature_store: "Feature Store",
	image_builder: "Image Builder",
	log_store: "Log Store",
	model_deployer: "Model Deployer",
	model_registry: "Model Registry",
	orchestrator: "Orchestrator",
	step_operator: "Step Operator",
};

function ComponentIdentity({ component }: { component: StackComponent }) {
	return (
		<>
			{component.logoUrl ? (
				<img src={component.logoUrl} alt="" className="size-4 shrink-0" />
			) : (
				<span className="bg-muted size-4 shrink-0 rounded" aria-hidden />
			)}
			<span className="text-foreground truncate font-mono text-xs font-semibold">
				{component.name}
			</span>
		</>
	);
}

export function StackComponentGroupCard({
	type,
	components,
}: {
	type: StackComponentType;
	components: StackComponent[];
}) {
	const [expanded, setExpanded] = useState(true);
	const usedCount = components.length;
	return (
		<div className="bg-card border-border overflow-hidden rounded-lg border">
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left hover:brightness-95"
				aria-expanded={expanded}
			>
				<ChevronRight
					className={cn(
						"text-muted-foreground size-3.5 shrink-0 transition-transform",
						expanded && "rotate-90"
					)}
				/>
				<span className="text-muted-foreground text-xs">
					{TYPE_LABEL[type] ?? type}
				</span>
				<Badge variant="outline" size="md">
					{usedCount}
				</Badge>
				<span className="flex-1" />
			</button>
			{expanded && (
				<div className="space-y-4 p-4">
					{components.map((component) => (
						<SingleStackComponentCard
							key={component.id}
							type={type}
							component={component}
							showTypeLabel={false}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export function SingleStackComponentCard({
	type,
	component,
	showTypeLabel = true,
}: {
	type: StackComponentType;
	component: StackComponent;
	showTypeLabel?: boolean;
}) {
	return (
		<div className="bg-secondary border-border flex items-center gap-2 rounded-lg border px-3 py-2">
			<span className="size-3.5 shrink-0" aria-hidden />
			{showTypeLabel && (
				<span className="text-muted-foreground w-36 shrink-0 truncate text-xs">
					{TYPE_LABEL[type] ?? type}
				</span>
			)}
			<ComponentIdentity component={component} />
		</div>
	);
}
