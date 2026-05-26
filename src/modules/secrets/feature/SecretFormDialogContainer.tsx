import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@zenml/hashi/primitives/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@zenml/hashi/primitives/input";

import { useCreateSecret } from "../business-logic/use-create-secret";
import { useUpdateSecret } from "../business-logic/use-update-secret";
import { secretQueryKeys } from "../business-logic/secret-queries";
import {
	secretFormSchema,
	type SecretFormValues,
} from "../business-logic/secret-form-schema";
import type { Secret } from "../domain/secrets";
import { SecretKeyEditor } from "../ui/SecretKeyEditor";
import { getErrorMessage } from "../business-logic/get-error-message";

type Mode = "add" | "edit";

type SecretFormDialogContainerProps = {
	mode: Mode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	secret?: Secret;
};

function initialKeys(secret?: Secret) {
	if (!secret?.keys?.length) return [{ key: "", value: "" }];
	return secret.keys.map((k) => ({ key: k.key, value: k.value }));
}

export function SecretFormDialogContainer({
	mode,
	open,
	onOpenChange,
	secret,
}: SecretFormDialogContainerProps) {
	const queryClient = useQueryClient();
	const form = useForm<SecretFormValues>({
		resolver: zodResolver(secretFormSchema),
		defaultValues: {
			name: secret?.name ?? "",
			keys: initialKeys(secret),
		},
	});
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "keys",
	});

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

	function handleFormSubmit(data: SecretFormValues) {
		const keys = data.keys
			.filter((row) => row.key.trim() !== "")
			.map((row) => ({ key: row.key.trim(), value: row.value }));

		if (mode === "add") {
			createSecret({ name: data.name, keys });
			return;
		}
		if (!secret) return;
		updateSecret({ secretId: secret.id, payload: { name: data.name, keys } });
	}

	function handleAddRow() {
		append({ key: "", value: "" });
	}

	function handleRemoveRow(index: number) {
		if (fields.length <= 1) {
			form.setValue(`keys.${index}.key`, "");
			form.setValue(`keys.${index}.value`, "");
			return;
		}
		remove(index);
	}

	const submitLabel = mode === "add" ? "Register Secret" : "Save Secret";
	const keysArrayError = form.formState.errors.keys?.root?.message;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{mode === "add" ? "Register New Secret" : "Edit Keys"}
					</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(handleFormSubmit)}
					className="flex flex-col gap-6"
				>
					<Controller
						control={form.control}
						name="name"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="secret-name">Secret name</FieldLabel>
								<Input
									{...field}
									id="secret-name"
									placeholder="my-api-credentials"
									disabled={mode === "edit"}
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<SecretKeyEditor
						control={form.control}
						fields={fields}
						arrayError={keysArrayError}
						onAdd={handleAddRow}
						onRemove={handleRemoveRow}
					/>
					<DialogFooter className="sm:justify-between">
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
