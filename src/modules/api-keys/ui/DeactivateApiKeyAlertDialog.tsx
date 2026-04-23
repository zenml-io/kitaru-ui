import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

import type { ApiKey } from "../domain/api-key";

type DeactivateApiKeyAlertDialogProps = {
	apiKey: ApiKey;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isPending?: boolean;
};

export function DeactivateApiKeyAlertDialog({
	apiKey,
	open,
	onOpenChange,
	onConfirm,
	isPending,
}: DeactivateApiKeyAlertDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Deactivate API key</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure? You won&apos;t be able to use{" "}
						<span className="text-foreground font-medium">{apiKey.name}</span>{" "}
						to authenticate with the server anymore.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="sm:justify-between">
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={isPending}
						onClick={onConfirm}
					>
						{isPending ? "Deactivating..." : "Deactivate"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
