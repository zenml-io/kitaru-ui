import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Switch } from "@zenml/hashi/primitives/switch";
import { WarningBanner } from "@/shared/ui/WarningBanner";

import { getErrorMessage } from "../business-logic/get-error-message";
import {
	rotateApiKeyFormSchema,
	type RotateApiKeyFormValues,
} from "../business-logic/rotate-api-key-form-schema";
import { apiKeyQueryKeys } from "../business-logic/api-key-queries";
import { useRotateApiKey } from "../business-logic/use-rotate-api-key";
import type { ApiKey } from "../domain/api-key";
import { ApiKeyRevealPanel } from "../ui/ApiKeyRevealPanel";

type RotateApiKeyDialogContainerProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	serviceAccountId: string;
	apiKey: ApiKey;
};

export function RotateApiKeyDialogContainer({
	open,
	onOpenChange,
	serviceAccountId,
	apiKey,
}: RotateApiKeyDialogContainerProps) {
	const queryClient = useQueryClient();
	const [revealKey, setRevealKey] = useState<string | null>(null);

	const form = useForm<RotateApiKeyFormValues>({
		resolver: zodResolver(rotateApiKeyFormSchema),
		defaultValues: { enableRetention: false, retainPeriodMinutes: "" },
	});
	const enableRetention = form.watch("enableRetention");

	const { rotateApiKeyAsync, isPending: isRotating } = useRotateApiKey({
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not rotate API key.")),
	});

	function handleClose(nextOpen: boolean) {
		if (!nextOpen) {
			if (revealKey) {
				void queryClient.invalidateQueries({
					queryKey: apiKeyQueryKeys.list(serviceAccountId),
				});
			}
			form.reset({ enableRetention: false, retainPeriodMinutes: "" });
			setRevealKey(null);
		}
		onOpenChange(nextOpen);
	}

	async function onSubmit(values: RotateApiKeyFormValues) {
		try {
			const rotated = await rotateApiKeyAsync({
				serviceAccountId,
				apiKeyId: apiKey.id,
				retainPeriodMinutes: values.enableRetention
					? Number(values.retainPeriodMinutes)
					: 0,
			});
			if (!rotated.plaintextKey) {
				toast.error(
					"API key was rotated but the plaintext value was missing from the response."
				);
				handleClose(false);
				return;
			}
			setRevealKey(rotated.plaintextKey);
		} catch (error) {
			toast.error(getErrorMessage(error, "Could not rotate API key."));
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{revealKey ? "API key rotated" : `Rotate "${apiKey.name}"`}
					</DialogTitle>
				</DialogHeader>
				{revealKey ? (
					<>
						<ApiKeyRevealPanel mode="rotate" plaintextKey={revealKey} />
						<DialogFooter>
							<Button onClick={() => handleClose(false)}>Done</Button>
						</DialogFooter>
					</>
				) : (
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						<WarningBanner>
							<p>
								Your current API key will be deactivated. Any processes or
								integrations using the old key will no longer function once the
								new key is generated.
							</p>
						</WarningBanner>
						<Controller
							control={form.control}
							name="enableRetention"
							render={({ field }) => (
								<Field>
									<label className="flex items-start gap-3">
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<div>
											<span className="text-sm font-medium">
												Keep the old key active for a retention period
											</span>
											<p className="text-muted-foreground text-xs">
												Minimize disruption by letting the old key remain valid
												alongside the new one for a number of minutes.
											</p>
										</div>
									</label>
								</Field>
							)}
						/>
						{enableRetention && (
							<Controller
								control={form.control}
								name="retainPeriodMinutes"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="api-key-retention">
											Retention period (minutes)
										</FieldLabel>
										<Input
											{...field}
											id="api-key-retention"
											type="number"
											min={1}
											step={1}
											placeholder="15"
											autoComplete="off"
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						)}
						<DialogFooter className="sm:justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleClose(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isRotating}>
								{isRotating ? "Rotating..." : "Rotate key"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
