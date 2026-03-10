import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/utils/styles";
import type { ComponentProps } from "react";

type DeviceVerificationCardProps = ComponentProps<typeof Card> & {
	showHeader?: boolean;
};

export function DeviceVerificationCard({
	children,
	className,
	showHeader = true,
	...props
}: DeviceVerificationCardProps) {
	return (
		<Card
			className={cn("w-full max-w-[400px] shadow-lg", className)}
			{...props}
		>
			<CardContent className="space-y-4 p-8">
				{showHeader && (
					<div className="flex flex-col gap-1 text-center">
						<h2 className="text-foreground text-lg font-semibold">
							Authorize a new device
						</h2>
						<p className="text-muted-foreground text-sm">
							You are logging in from a new device
						</p>
					</div>
				)}
				{children}
			</CardContent>
		</Card>
	);
}
