import { Button } from "@/shared/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "@untitledui/icons";

export function DefaultPageNotFound() {
	return (
		<div className="flex min-h-dvh flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center px-4">
				<p className="text-foreground/15 font-mono text-9xl font-normal">404</p>
				<h1 className="text-foreground mt-4 text-2xl font-semibold tracking-tight">
					Page not found
				</h1>
				<p className="text-muted-foreground mt-4 text-center text-lg">
					The page you're looking for doesn't exist or the URL may have changed.
					<br />
					Check the address or head back to your workflows.
				</p>
				<div className="mt-8 flex items-center justify-center gap-3">
					<Button
						nativeButton={false}
						render={
							<Link className="min-w-44" to="/flows">
								<ChevronLeft />
								Go to Flows
							</Link>
						}
					></Button>
				</div>
			</div>
		</div>
	);
}
