import { useState } from "react";
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
import { getErrorMessage } from "../business-logic/get-error-message";
import { createKeyRows, useKeyRows } from "../business-logic/use-key-rows";

type Mode = "add" | "edit";

type SecretFormDialogContainerProps = {
	mode: Mode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	secret?: Secret;
};

export function SecretFormDialogContainer({
	mode,
	open,
	onOpenChange,
	secret,
}: SecretFormDialogContainerProps) {
	const queryClient = useQueryClient();
	const [name, setName] = useState(secret?.name ?? "");
	const { rows, addRow, removeRow, updateRow, toggleVisibility } = useKeyRows(
		createKeyRows(secret?.keys)
	);

	const { createSecret, isPending: isCreatePending } = useCreateSecret({
		onSuccess: async () => {
			toast.success("Secret created");
			await queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			onOpenChange(false);
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not create secret.")),
	});

	const { updateSecret, isPending: isUpdatePending } = useUpdateSecret({
		onSuccess: async () => {
			toast.success("Secret updated");
			await queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			onOpenChange(false);
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not update secret.")),
	});

	const isPending = isCreatePending || isUpdatePending;

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (isPending) return;

		const trimmedName = name.trim();
		if (!trimmedName) {
			toast.error("Please enter a secret name.");
			return;
		}

		const keys = rows
			.filter((row) => row.key.trim() !== "")
			.map((row) => ({ key: row.key.trim(), value: row.value }));

		if (keys.length === 0) {
			toast.error("Add at least one key.");
			return;
		}

		const seen = new Set<string>();
		for (const k of keys) {
			if (seen.has(k.key)) {
				toast.error(`Duplicate key: "${k.key}".`);
				return;
			}
			seen.add(k.key);
		}

		if (mode === "add") {
			createSecret({ name: trimmedName, keys });
			return;
		}
		if (!secret) return;
		updateSecret({ secretId: secret.id, payload: { name: trimmedName, keys } });
	}

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
