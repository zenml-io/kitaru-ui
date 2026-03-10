import { Button } from "@/shared/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "@untitledui/icons";

export function DefaultPageNotFound() {
	return (
		<div className="flex min-h-dvh flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center space-y-6 px-4">
				<p className="text-muted-foreground/30 font-mono text-8xl font-bold">
					404
				</p>
				<div className="max-w-md space-y-2 text-center">
					<h1 className="text-foreground text-xl font-semibold">
						Page not found
					</h1>
					<p className="text-muted-foreground text-sm text-pretty">
						The page you're looking for doesn't exist or the URL may have
						changed. Check the address or head back to your flows.
					</p>
				</div>
				<div className="flex items-center justify-center gap-3">
					<Button
						nativeButton={false}
						className="min-w-44"
						render={<Link to="/flows" />}
					>
						<ChevronLeft />
						Go to Flows
					</Button>
				</div>
				<code className="text-muted-foreground/60 bg-muted/50 rounded-md px-3 py-1.5 font-mono text-xs">
					GET {window.location.pathname}
				</code>
			</div>
		</div>
	);
}
