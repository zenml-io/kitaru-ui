import {
	Check,
	CircleCheck,
	CircleSlash,
	Copy,
	ExternalLink,
} from "lucide-react";
import { useState } from "react";
import type { DockerImage } from "@/modules/builds/domain/build";
import { useCopy } from "@/shared/business-logic/use-copy";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/utils/styles";
import { ConfigurationSectionHeader } from "./ConfigurationSectionHeader";
import { DockerCodeBlock } from "./DockerCodeBlock";

type Props = {
	dockerImage: DockerImage;
	pythonVersion?: string;
};

function ImageRow({ dockerImage }: { dockerImage: DockerImage }) {
	const { copied, copy } = useCopy();
	const lastSlash = dockerImage.image.lastIndexOf("/");
	const lastColon = dockerImage.image.lastIndexOf(":");
	const imageWithoutTag =
		lastColon > lastSlash
			? dockerImage.image.slice(0, lastColon)
			: dockerImage.image;
	const registryUrl = `https://${imageWithoutTag}`;
	return (
		<div className="flex items-center gap-4 py-1">
			<span className="text-muted-foreground w-28 shrink-0 text-xs">
				Docker image
			</span>
			<span className="text-foreground truncate font-mono text-xs">
				{dockerImage.image}
			</span>
			<div className="flex shrink-0 items-center gap-0.5">
				<a
					href={registryUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Open image registry"
					className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
				>
					<ExternalLink className="size-3.5" />
				</a>
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

function ContainsCodeRow({ dockerImage }: { dockerImage: DockerImage }) {
	if (dockerImage.containsCode === undefined) return null;
	return (
		<div className="flex items-center gap-4 py-1">
			<span className="text-muted-foreground w-28 shrink-0 text-xs">
				Contains Code
			</span>
			{dockerImage.containsCode ? (
				<CircleCheck
					className="text-success size-4"
					role="img"
					aria-label="Yes"
				/>
			) : (
				<CircleSlash
					className="text-muted-foreground size-4"
					role="img"
					aria-label="No"
				/>
			)}
		</div>
	);
}

export function DockerImageSection({ dockerImage, pythonVersion }: Props) {
	const [expanded, setExpanded] = useState(true);
	return (
		<div>
			<ConfigurationSectionHeader
				label="Docker Image"
				expanded={expanded}
				onToggle={() => setExpanded((v) => !v)}
			/>
			{expanded && (
				<div className="space-y-3 px-4 pb-4">
					<ImageRow dockerImage={dockerImage} />
					{dockerImage.dockerfile && (
						<DockerCodeBlock
							label="Dockerfile"
							code={dockerImage.dockerfile}
							language="bash"
						/>
					)}
					{dockerImage.requirements && (
						<DockerCodeBlock
							label="Requirements"
							code={dockerImage.requirements}
						/>
					)}
					<PythonRow pythonVersion={pythonVersion} />
					<ContainsCodeRow dockerImage={dockerImage} />
				</div>
			)}
		</div>
	);
}
