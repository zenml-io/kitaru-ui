import { Button } from "@zenml/hashi/primitives/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zenml/hashi/primitives/empty";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function DefaultPageNotFound() {
	return (
		<Empty>
			<EmptyHeader className="max-w-md">
				<EmptyMedia>
					<span className="text-muted-foreground/30 font-mono text-8xl font-bold">
						404
					</span>
				</EmptyMedia>
				<EmptyTitle>Page not found</EmptyTitle>
				<EmptyDescription>
					The page you're looking for doesn't exist or the URL may have changed.
					Check the address or head back to your flows.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					className="min-w-44"
					render={<Link to="/flows" />}
				>
					<ChevronLeft />
					Go to Flows
				</Button>

				<code className="text-muted-foreground/60 bg-muted/50 rounded-md px-3 py-1.5 font-mono text-xs">
					GET {window.location.pathname}
				</code>
			</EmptyContent>
		</Empty>
	);
}
