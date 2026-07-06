import { cn } from "@zenml/hashi/lib/utils";

interface IdentityBandProps {
	className?: string;
	children: React.ReactNode;
}

export function IdentityBand({ className, children }: IdentityBandProps) {
	return (
		<section className="bg-secondary border-border shrink-0 border-b">
			<div className={cn("px-8 pt-5 pb-4", className)}>{children}</div>
		</section>
	);
}
