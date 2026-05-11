import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Switch } from "@/shared/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
	replayExecutionSchema,
	type ReplayExecutionFormValues,
} from "../domain/replay-execution-schema";

type Props = {
	formId: string;
	isExecutionFailed: boolean;
	onSubmit: (data: ReplayExecutionFormValues) => void;
};

export function ReplayExecutionFormContainer({
	isExecutionFailed,
	onSubmit,
	formId,
}: Props) {
	const form = useForm<ReplayExecutionFormValues>({
		resolver: zodResolver(replayExecutionSchema),
		defaultValues: {
			skipSuccessfulSteps: isExecutionFailed,
		},
	});

	function handleSubmit(data: ReplayExecutionFormValues) {
		onSubmit(data);
	}
	return (
		<form
			id={formId}
			onSubmit={form.handleSubmit(handleSubmit)}
			className="flex flex-col gap-6"
		>
			<Controller
				name="skipSuccessfulSteps"
				control={form.control}
				render={({ field: { value, onChange, ...rest }, fieldState }) => (
					<Field orientation="horizontal" data-invalid={fieldState.invalid}>
						<Switch
							checked={value}
							onCheckedChange={onChange}
							{...rest}
							id="skip-successful-steps"
							aria-invalid={fieldState.invalid}
						/>
						<FieldLabel className="w-fit" htmlFor="skip-successful-steps">
							Skip successful checkpoints
						</FieldLabel>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</form>
	);
}
