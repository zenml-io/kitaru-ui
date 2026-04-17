import { useMemo, useState } from "react";
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

import { useCreateSecret } from "../business-logic/use-create-secret";
import { useUpdateSecret } from "../business-logic/use-update-secret";
import { secretQueryKeys } from "../business-logic/secret-queries";
import type { Secret } from "../domain/secrets";
import { SecretKeyEditor } from "../ui/SecretKeyEditor";
import { createKeyRows, useKeyRows } from "../util/use-key-rows";

type Mode = "add" | "edit";

type SecretFormDialogProps = {
	mode: Mode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	secret?: Secret;
};

export function SecretFormDialog({
	mode,
	open,
	onOpenChange,
	secret,
}: SecretFormDialogProps) {
	const queryClient = useQueryClient();
	const initialRows = useMemo(() => createKeyRows(secret?.keys), [secret]);
	const [name, setName] = useState(secret?.name ?? "");
	const { rows, addRow, removeRow, updateRow, toggleVisibility } =
		useKeyRows(initialRows);

	const { createSecret, isPending: isCreatePending } = useCreateSecret({
		onSuccess: () => {
			toast.success("Secret created");
			queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			onOpenChange(false);
		},
		onError: (error) => toast.error(error.message),
	});

	const { updateSecret, isPending: isUpdatePending } = useUpdateSecret({
		onSuccess: () => {
			toast.success("Secret updated");
			queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			onOpenChange(false);
		},
		onError: (error) => toast.error(error.message),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const keys = rows
			.filter((row) => row.key.trim() !== "")
			.map((row) => ({ key: row.key, value: row.value }));

		if (mode === "add") {
			createSecret({ name, keys });
			return;
		}
		if (!secret) return;
		updateSecret({ secretId: secret.id, payload: { name, keys } });
	}

	const isPending = isCreatePending || isUpdatePending;
	const submitLabel = mode === "add" ? "Register Secret" : "Save Secret";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{mode === "add" ? "Register New Secret" : "Edit Keys"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					<Field>
						<FieldLabel htmlFor="secret-name">Secret name</FieldLabel>
						<Input
							id="secret-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="my-api-credentials"
							disabled={mode === "edit"}
							required
						/>
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
							{isPending ? "Saving..." : submitLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
