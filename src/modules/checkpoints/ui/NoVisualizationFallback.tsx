import { useCopy } from "@/shared/business-logic/use-copy";
import { Button } from "@/shared/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/shared/ui/empty";
import { Archive, Check, Copy01 } from "@untitledui/icons";
import type { ArtifactVersion } from "../domain/fetch-artifact-version";

interface NoVisualizationFallbackProps {
	artifactVersion: ArtifactVersion;
}

export function NoVisualizationFallback({
	artifactVersion,
}: NoVisualizationFallbackProps) {
	const { body } = artifactVersion;
	const { copied, copy } = useCopy();

	const subtitle =
		body?.artifact_store_id == null
			? "No artifact store is configured for this artifact"
			: "This artifact was saved without a visualization";

	const uri = body?.uri;
	const dataType = body?.data_type
		? `${body.data_type.module}${body.data_type.attribute ? `.${body.data_type.attribute}` : ""}`
		: null;
	const artifactType = body?.type;

	return (
		<Empty>
			<EmptyHeader className="max-w-md">
				<EmptyMedia variant="icon" className="size-14 rounded-full">
					<Archive className="size-7" />
				</EmptyMedia>
				<EmptyTitle>No visualization available</EmptyTitle>
				<p className="text-muted-foreground text-sm">{subtitle}</p>
			</EmptyHeader>
			{(uri || dataType || artifactType) && (
				<EmptyContent className="max-w-lg">
					{uri && (
						<div className="group/uri border-border w-full overflow-hidden rounded-md border">
							<div className="bg-secondary flex items-center justify-between px-3 py-1.5">
								<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
									Storage path
								</span>
								<Button
									variant="ghost"
									size="icon-sm"
									className="opacity-0 transition-opacity group-hover/uri:opacity-100"
									onClick={() => copy(uri)}
								>
									{copied ? (
										<Check className="text-success h-3.5 w-3.5" />
									) : (
										<Copy01 className="text-muted-foreground h-3.5 w-3.5" />
									)}
									<span className="sr-only">
										{copied ? "Copied" : "Copy to clipboard"}
									</span>
								</Button>
							</div>
							<div className="bg-background p-3 font-mono text-xs leading-snug break-words whitespace-pre-wrap">
								{uri}
							</div>
						</div>
					)}
					{(dataType || artifactType) && (
						<div className="flex flex-wrap gap-x-6 gap-y-2">
							{dataType && (
								<div className="flex flex-col gap-1">
									<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
										Data type
									</span>
									<span className="bg-muted text-muted-foreground rounded px-2 py-0.5 font-mono text-xs">
										{dataType}
									</span>
								</div>
							)}
							{artifactType && (
								<div className="flex flex-col gap-1">
									<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
										Artifact type
									</span>
									<span className="text-muted-foreground text-xs">
										{artifactType}
									</span>
								</div>
							)}
						</div>
					)}
				</EmptyContent>
			)}
		</Empty>
	);
}
