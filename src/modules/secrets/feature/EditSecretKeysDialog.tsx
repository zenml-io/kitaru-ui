import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { secretQueryKeys } from "../business-logic/secret-queries";
import { useUpdateSecret } from "../business-logic/use-update-secret";
import type { Secret } from "../domain/secrets";
import { SecretKeyEditor } from "../ui/SecretKeyEditor";
import { createKeyRows, useKeyRows } from "../util/use-key-rows";

type EditSecretKeysDialogProps = {
	secret: Secret;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function EditSecretKeysDialog({
	secret,
	open,
	onOpenChange,
}: EditSecretKeysDialogProps) {
	const queryClient = useQueryClient();
	const initialRows = useMemo(() => createKeyRows(secret.keys), [secret.keys]);
	const { rows, addRow, removeRow, updateRow, toggleVisibility } =
		useKeyRows(initialRows);

	const { updateSecret, isPending } = useUpdateSecret({
		onSuccess: () => {
			toast.success("Secret updated");
			queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			onOpenChange(false);
		},
		onError: (error) => toast.error(error.message),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (isPending) return;
		const keys = rows
			.filter((row) => row.key.trim() !== "")
			.map((row) => ({ key: row.key, value: row.value }));
		updateSecret({ secretId: secret.id, payload: { keys } });
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Keys</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					<Field>
						<FieldLabel htmlFor="edit-secret-name">Secret name</FieldLabel>
						<Input id="edit-secret-name" value={secret.name} disabled />
					</Field>
					<SecretKeyEditor
						rows={rows}
						onAdd={addRow}
						onRemove={removeRow}
						onUpdate={updateRow}
						onToggleVisibility={toggleVisibility}
					/>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save Secret"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
