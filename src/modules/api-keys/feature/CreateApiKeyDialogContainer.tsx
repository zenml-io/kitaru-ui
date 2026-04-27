import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { getErrorMessage } from "../business-logic/get-error-message";
import {
	apiKeyFormSchema,
	type ApiKeyFormValues,
} from "../business-logic/api-key-form-schema";
import { apiKeyQueryKeys } from "../business-logic/api-key-queries";
import { useCreateApiKey } from "../business-logic/use-create-api-key";
import { findOrCreatePersonalServiceAccount } from "../domain/find-or-create-personal-service-account";
import { personalServiceAccountQueryKeys } from "../business-logic/personal-service-account-queries";
import { ApiKeyRevealPanel } from "../ui/ApiKeyRevealPanel";

type CreateApiKeyDialogContainerProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userId: string;
	serviceAccountId?: string;
};

export function CreateApiKeyDialogContainer({
	open,
	onOpenChange,
	userId,
	serviceAccountId,
}: CreateApiKeyDialogContainerProps) {
	const queryClient = useQueryClient();
	const [revealKey, setRevealKey] = useState<string | null>(null);
	const [isResolvingSa, setIsResolvingSa] = useState(false);
	const [resolvedServiceAccountId, setResolvedServiceAccountId] = useState<
		string | undefined
	>(undefined);

	const form = useForm<ApiKeyFormValues>({
		resolver: zodResolver(apiKeyFormSchema),
		defaultValues: { name: "", description: "" },
	});

	const { createApiKeyAsync, isPending: isCreating } = useCreateApiKey({
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not create API key.")),
	});

	function handleClose(nextOpen: boolean) {
		if (!nextOpen) {
			if (revealKey && resolvedServiceAccountId) {
				void queryClient.invalidateQueries({
					queryKey: apiKeyQueryKeys.list(resolvedServiceAccountId),
				});
			}
			form.reset({ name: "", description: "" });
			setRevealKey(null);
			setResolvedServiceAccountId(undefined);
		}
		onOpenChange(nextOpen);
	}

	async function onSubmit(values: ApiKeyFormValues) {
		try {
			let saId = serviceAccountId;
			if (!saId) {
				setIsResolvingSa(true);
				const resolved = await findOrCreatePersonalServiceAccount(userId);
				saId = resolved.id;
				await queryClient.invalidateQueries({
					queryKey: personalServiceAccountQueryKeys.resolve(userId),
				});
			}
			const created = await createApiKeyAsync({
				serviceAccountId: saId,
				name: values.name,
				description: values.description?.trim() || undefined,
			});
			if (!created.plaintextKey) {
				toast.error(
					"API key was created but the plaintext value was missing from the response."
				);
				handleClose(false);
				return;
			}
			setRevealKey(created.plaintextKey);
			setResolvedServiceAccountId(saId);
		} catch (error) {
			toast.error(getErrorMessage(error, "Could not create API key."));
		} finally {
			setIsResolvingSa(false);
		}
	}

	const isSubmitting = isCreating || isResolvingSa;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{revealKey ? "API key created" : "Create API key"}
					</DialogTitle>
				</DialogHeader>
				{revealKey ? (
					<>
						<ApiKeyRevealPanel mode="create" plaintextKey={revealKey} />
						<DialogFooter>
							<Button onClick={() => handleClose(false)}>Done</Button>
						</DialogFooter>
					</>
				) : (
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						<Controller
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="api-key-name">Name</FieldLabel>
									<Input
										{...field}
										id="api-key-name"
										placeholder="ci-production"
										autoComplete="off"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name="description"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="api-key-description">
										Description{" "}
										<span className="text-muted-foreground">(optional)</span>
									</FieldLabel>
									<Input
										{...field}
										id="api-key-description"
										placeholder="Used by the production CI pipeline"
										autoComplete="off"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<DialogFooter className="sm:justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleClose(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Creating..." : "Create API key"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
