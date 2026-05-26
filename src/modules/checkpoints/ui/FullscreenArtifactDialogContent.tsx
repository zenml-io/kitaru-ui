import type { ReactNode } from "react";
import { Button } from "@zenml/hashi/primitives/button";
import {
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Separator } from "@zenml/hashi/primitives/separator";
import { TruncatedText } from "@/shared/ui/truncated-text";
import { X } from "lucide-react";

type Props = {
	name: string;
	actions?: ReactNode;
	children: ReactNode;
};

export function FullscreenArtifactDialogContent({
	name,
	actions,
	children,
}: Props) {
	return (
		<DialogContent
			showCloseButton={false}
			className="flex h-[90vh] w-[90vw] flex-col gap-0 p-0 sm:max-w-[90vw]"
		>
			<DialogHeader className="bg-muted/50 flex-row items-center justify-between px-4 py-2">
				<DialogTitle className="text-foreground text-xs font-semibold">
					<TruncatedText>{name}</TruncatedText>
				</DialogTitle>
				<div className="flex items-center gap-1">
					{actions}
					<DialogClose
						render={
							<Button variant="ghost" size="icon-sm">
								<X className="text-foreground h-3.5 w-3.5" />
								<span className="sr-only">Close</span>
							</Button>
						}
					/>
				</div>
			</DialogHeader>
			<Separator />
			<div className="min-h-0 flex-1">{children}</div>
		</DialogContent>
	);
}
