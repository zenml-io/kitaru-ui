import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/shared/ui/empty";
import { ExternalLink, HardDrive, KeyRound, PackageX } from "lucide-react";
import type { ReactNode } from "react";

type DocsLink = {
	href: string;
	label: string;
};

type LayoutProps = {
	icon: ReactNode;
	title: string;
	description: ReactNode;
	uri?: string;
	stillWorks?: ReactNode;
	docsLink: DocsLink;
};

function ArtifactStoreFallbackLayout({
	icon,
	title,
	description,
	uri,
	stillWorks,
	docsLink,
}: LayoutProps) {
	return (
		<Empty className="gap-3 p-8">
			<EmptyHeader className="max-w-lg gap-2">
				<EmptyMedia variant="icon" className="size-10 rounded-full">
					{icon}
				</EmptyMedia>
				<EmptyTitle className="text-base">{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="max-w-lg gap-3">
				{uri && (
					<code className="bg-muted text-foreground block w-full rounded-md px-3 py-2 text-left font-mono text-xs wrap-anywhere">
						{uri}
					</code>
				)}
				{stillWorks && (
					<p className="text-muted-foreground text-xs text-balance">
						{stillWorks}
					</p>
				)}
				<a
					href={docsLink.href}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
				>
					{docsLink.label}
					<ExternalLink className="size-3.5" />
				</a>
			</EmptyContent>
		</Empty>
	);
}

const STACKS_DOCS = "https://kitaru.ai/docs/stacks/";

type LocalProps = {
	uri?: string;
};

export function LocalArtifactStoreFallback({ uri }: LocalProps) {
	return (
		<ArtifactStoreFallbackLayout
			icon={<HardDrive className="size-5" />}
			title="Stored in a local artifact store"
			description="This artifact was saved to a local path. The server can't reach local files, so visualizations and downloads aren't available here."
			uri={uri}
			stillWorks="If you want to inspect artifacts through the UI, set up and use a remote artifact store."
			docsLink={{
				label: "Set up a remote artifact store",
				href: STACKS_DOCS,
			}}
		/>
	);
}

type NoConnectorProps = {
	uri?: string;
};

export function NoConnectorArtifactStoreFallback({ uri }: NoConnectorProps) {
	return (
		<ArtifactStoreFallbackLayout
			icon={<KeyRound className="size-5" />}
			title="Service connector required"
			description="The artifact store for this run has no service connector configured, so the server can't authenticate to read this artifact."
			uri={uri}
			stillWorks="If you want to inspect artifacts through the UI, configure a service connector for this artifact store."
			docsLink={{
				label: "Connect a service connector",
				href: STACKS_DOCS,
			}}
		/>
	);
}

export function DepsMissingArtifactStoreFallback() {
	return (
		<ArtifactStoreFallbackLayout
			icon={<PackageX className="size-5" />}
			title="Missing server dependencies"
			description="The server can't load this artifact store because the required Python dependencies aren't installed."
			docsLink={{
				label: "Artifact store setup",
				href: STACKS_DOCS,
			}}
		/>
	);
}
