import { useDeployment } from "@/modules/deployments/business-logic/use-deployment";
import { Button } from "@/shared/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/sheet";
import { Play, X } from "lucide-react";
import { useState } from "react";

type ReplayExecutionSheetProps = {
	executionId: string;
	snapshotId: string;
};

export function ReplayExecutionSheet({
	executionId,
	snapshotId,
}: ReplayExecutionSheetProps) {
	const { data: deployment } = useDeployment(snapshotId);
	const [open, setOpen] = useState(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				render={<Button variant="outline" type="button" size="sm" />}
			>
				<Play className="size-3.5" />
				Replay
			</SheetTrigger>
			<SheetContent className="sm:max-w-1/2" showCloseButton={false}>
				<div className="border-border flex items-center justify-between border-b px-4 py-3">
					<SheetTitle className="text-sm font-semibold">
						Replay Execution {executionId}
					</SheetTitle>
					<SheetClose render={<Button variant="ghost" size="icon-sm" />}>
						<X className="size-4" />
						<span className="sr-only">Close</span>
					</SheetClose>
				</div>
				{deployment.flowName}
			</SheetContent>
		</Sheet>
	);
}
