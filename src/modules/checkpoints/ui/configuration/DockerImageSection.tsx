import { Check, Copy, ExternalLink } from "lucide-react";
import type { DockerImage } from "@/modules/builds/domain/build";
import { useCopy } from "@/shared/business-logic/use-copy";
import { Button, buttonVariants } from "@zenml/hashi/primitives/button";
import { Collapsible, CollapsibleContent } from "@zenml/hashi/primitives/collapsible";
import { cn } from "@/shared/utils/styles";
import { ConfigurationSectionHeader } from "./ConfigurationSectionHeader";
import { DockerCodeBlock } from "./DockerCodeBlock";

type DockerImageSectionProps = {
	dockerImage: DockerImage | null;
	pythonVersion?: string;
	registryUrl: string | null;
};

function ImageRow({
	dockerImage,
	registryUrl,
}: {
	dockerImage: DockerImage;
	registryUrl: string | null;
}) {
	const { copied, copy } = useCopy();
	return (
		<div className="flex items-center gap-4 py-1">
			<span className="text-muted-foreground w-28 shrink-0 text-xs">
				Docker image
			</span>
			<span className="text-foreground truncate font-mono text-xs">
				{dockerImage.image}
			</span>
			<div className="flex shrink-0 items-center gap-0.5">
				{registryUrl !== null && (
					<a
						href={registryUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Open image registry"
						className={cn(
							buttonVariants({ variant: "ghost", size: "icon-sm" })
						)}
					>
						<ExternalLink className="size-3.5" />
					</a>
				)}
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => copy(dockerImage.image)}
					aria-label="Copy image name"
				>
					{copied ? (
						<Check className="text-success size-3.5" />
					) : (
						<Copy className="size-3.5" />
					)}
				</Button>
			</div>
		</div>
	);
}

function PythonRow({ pythonVersion }: { pythonVersion?: string }) {
	if (!pythonVersion) return null;
	return (
		<div className="flex items-center gap-4 py-1">
			<span className="text-muted-foreground w-28 shrink-0 text-xs">
				Python Snapshot
			</span>
			<span className="text-foreground font-mono text-xs">{pythonVersion}</span>
		</div>
	);
}

export function DockerImageSection({
	dockerImage,
	pythonVersion,
	registryUrl,
}: DockerImageSectionProps) {
	return (
		<Collapsible defaultOpen>
			<ConfigurationSectionHeader label="Docker Image" />
			<CollapsibleContent className="space-y-3 px-4 pb-4">
				{dockerImage === null ? (
					<p className="text-muted-foreground text-xs">
						No matching Docker image was found for this checkpoint.
					</p>
				) : (
					<>
						<ImageRow dockerImage={dockerImage} registryUrl={registryUrl} />
						{dockerImage.dockerfile && (
							<DockerCodeBlock
								label="Dockerfile"
								code={dockerImage.dockerfile}
								language="dockerfile"
							/>
						)}
						{dockerImage.requirements && (
							<DockerCodeBlock
								label="Requirements"
								code={dockerImage.requirements}
							/>
						)}
						<PythonRow pythonVersion={pythonVersion} />
					</>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
}
