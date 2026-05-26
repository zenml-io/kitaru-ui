import { useState } from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@zenml/hashi/primitives/alert-dialog";
import { Button } from "@zenml/hashi/primitives/button";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@zenml/hashi/primitives/input";

type DeleteAlertDialogProps = {
	title: string;
	description: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isPending?: boolean;
	actionLabel?: string;
	pendingLabel?: string;
};

export function DeleteAlertDialog({
	title,
	description,
	open,
	onOpenChange,
	onConfirm,
	isPending = false,
	actionLabel = "Delete",
	pendingLabel = "Deleting...",
}: DeleteAlertDialogProps) {
	const [confirmText, setConfirmText] = useState("");
	const isConfirmed = confirmText === "DELETE";

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			setConfirmText("");
		}
		onOpenChange(nextOpen);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isConfirmed) return;
		onConfirm();
	}

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<form onSubmit={handleSubmit}>
					<Field>
						<FieldLabel htmlFor="delete-confirm">
							Type <span className="text-foreground font-medium">DELETE</span>{" "}
							to confirm
						</FieldLabel>
						<Input
							id="delete-confirm"
							value={confirmText}
							onChange={(e) => setConfirmText(e.target.value)}
							onPaste={(e) => e.preventDefault()}
							placeholder="DELETE"
							autoComplete="off"
						/>
					</Field>
					<AlertDialogFooter className="mt-6 sm:justify-between">
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button
							type="submit"
							variant="destructive"
							disabled={!isConfirmed || isPending}
						>
							{isPending ? pendingLabel : actionLabel}
						</Button>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
