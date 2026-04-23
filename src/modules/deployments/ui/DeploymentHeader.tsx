import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/utils/styles";
import type { Deployment } from "../domain/deployment";
import type { StackComponent } from "@/modules/stacks/domain/stack";
import { DeploymentTagChip } from "./DeploymentTagChip";
import { isLocalDeployment } from "../domain/local-deployment";

export function DeploymentHeader({
	flowName,
	deployment,
	stackComponents,
}: {
	flowName: string;
	deployment?: Deployment;
	stackComponents?: StackComponent[];
}) {
	const isDefault = deployment?.tags.some((t) => t.kind === "default") ?? false;
	const hasTags = (deployment?.tags.length ?? 0) > 0;

	return (
		<section className="bg-secondary border-border border-b">
			<div className="px-8 pt-5 pb-4">
				<div className="flex flex-wrap items-center gap-3">
					<h1 className="text-foreground inline-flex min-w-0 flex-wrap items-baseline gap-2 font-mono text-lg font-semibold">
						<span className="truncate">{flowName}</span>
						{deployment &&
							(isLocalDeployment(deployment) ? (
								<>
									<span className="text-muted-foreground" aria-hidden>
										·
									</span>
									<span className="text-muted-foreground text-xs font-normal italic">
										not deployed
									</span>
								</>
							) : (
								<>
									<span className="text-muted-foreground" aria-hidden>
										·
									</span>
									<span className="text-foreground">
										v{deployment.versionNumber}
									</span>
								</>
							))}
						{deployment && !isLocalDeployment(deployment) && isDefault && (
							<span className="text-muted-foreground text-xs font-normal">
								(default)
							</span>
						)}
					</h1>

					{deployment && !isLocalDeployment(deployment) && hasTags && (
						<>
							<Separator orientation="vertical" className="h-5" />
							<div className="flex min-w-0 flex-wrap items-center gap-1">
								{deployment.tags.map((t) => (
									<DeploymentTagChip key={t.id} tag={t} size="sm" />
								))}
							</div>
						</>
					)}

					{!deployment && (
						<span className="text-muted-foreground ml-auto text-xs">
							No deployments yet
						</span>
					)}
				</div>

				{deployment &&
					!isLocalDeployment(deployment) &&
					deployment.stackName && (
						<div className="mt-3 flex flex-wrap items-center gap-2">
							<span
								className={cn(
									"text-2xs font-semibold tracking-wider uppercase",
									"text-muted-foreground shrink-0"
								)}
							>
								Stack
							</span>
							{stackComponents && stackComponents.length > 0 ? (
								stackComponents.map((c) => (
									<span
										key={c.id}
										className={cn(
											"inline-flex h-6 items-center gap-1.5 rounded-md px-2",
											"border-border bg-card border",
											"text-foreground font-mono text-xs"
										)}
										title={`${c.type}: ${c.flavorName}`}
									>
										{c.logoUrl && (
											<img
												src={c.logoUrl}
												alt=""
												className="size-3.5 shrink-0"
												aria-hidden
											/>
										)}
										<span className="truncate">{c.flavorName}</span>
									</span>
								))
							) : (
								<span
									className={cn(
										"inline-flex h-6 items-center rounded-md px-2",
										"border-border bg-card border",
										"text-foreground font-mono text-xs"
									)}
								>
									{deployment.stackName}
								</span>
							)}
						</div>
					)}
			</div>
		</section>
	);
}
