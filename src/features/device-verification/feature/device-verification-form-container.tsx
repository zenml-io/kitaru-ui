import { Controller, useForm } from "react-hook-form";
import {
	verificationFormSchema,
	type VerificationForm,
} from "../domain/device-verification-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/shared/ui/field";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { useMutation } from "@tanstack/react-query";
import {
	verifyDeviceMutationOptions,
	type VerifyDeviceVariables,
} from "../domain/mutations/verify-device-mutation";
import { toast } from "sonner";

type Props = {
	deviceId: string;
	userCode: string;
	onVerified: () => void;
};

export function DeviceVerificationFormContainer({
	deviceId,
	userCode,
	onVerified,
}: Props) {
	const form = useForm<VerificationForm>({
		resolver: zodResolver(verificationFormSchema),
		defaultValues: {
			trustDevice: false,
		},
	});

	const { mutate, isPending: isMutationPending } = useMutation(
		verifyDeviceMutationOptions({
			onSuccess: () => {
				onVerified();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		})
	);

	function handleSubmit(data: VerificationForm) {
		const variables: VerifyDeviceVariables = {
			deviceId,
			payload: {
				user_code: userCode,
				trusted_device: data.trustDevice,
			},
		};

		mutate(variables);
	}

	return (
		<form onSubmit={form.handleSubmit(handleSubmit)}>
			<FieldGroup className="gap-4">
				<Controller
					name="trustDevice"
					control={form.control}
					render={({ field: { value, onChange, ...rest }, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<div className="flex flex-row items-start gap-2.5">
								<Checkbox
									id="trustDevice"
									checked={value}
									onCheckedChange={onChange}
									{...rest}
								/>
								<FieldLabel
									htmlFor="trustDevice"
									className="text-foreground text-sm"
								>
									Trust this device - We won't ask you again soon on this device
								</FieldLabel>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Button
					disabled={form.formState.isSubmitting || isMutationPending}
					type="submit"
				>
					Authorize This Device
				</Button>
			</FieldGroup>
		</form>
	);
}
