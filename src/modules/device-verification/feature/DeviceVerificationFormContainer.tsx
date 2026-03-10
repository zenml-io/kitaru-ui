import { useVerifyDevice } from "@/modules/device-verification/business-logic/use-verify-device";
import {
	verificationFormSchema,
	type VerificationForm,
} from "@/modules/device-verification/domain/device-verification-form-schema";
import type { VerifyDeviceVariables } from "@/modules/device-verification/domain/verify-device";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type DeviceVerificationFormContainerProps = {
	deviceId: string;
	userCode: string;
	onVerified: () => void;
};

export function DeviceVerificationFormContainer({
	deviceId,
	userCode,
	onVerified,
}: DeviceVerificationFormContainerProps) {
	const form = useForm<VerificationForm>({
		resolver: zodResolver(verificationFormSchema),
		defaultValues: {
			trustDevice: false,
		},
	});

	const { verifyDevice, isPending: isMutationPending } = useVerifyDevice({
		onSuccess: () => {
			onVerified();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	function handleSubmit(data: VerificationForm) {
		const variables: VerifyDeviceVariables = {
			deviceId,
			payload: {
				user_code: userCode,
				trusted_device: data.trustDevice,
			},
		};

		verifyDevice(variables);
	}

	const handleFormSubmit = form.handleSubmit(handleSubmit);

	return (
		<form onSubmit={handleFormSubmit}>
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
