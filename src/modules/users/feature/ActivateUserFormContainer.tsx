import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	activateUserSchema,
	type ActivateUserPayload,
} from "../business-logic/activate-user-schema";
import { useActivateUserAndLogin } from "../business-logic/use-activate-user";

export function ActivateUserFormContainer() {
	const navigate = useNavigate();
	const { user, token, username } = useSearch({
		from: "/(public)/_mesh/activate-user",
	});
	const { activateUser, isPending: isActivationFlowPending } =
		useActivateUserAndLogin({
			onSuccess: () => {
				navigate({ to: "/flows" });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	const form = useForm<ActivateUserPayload>({
		resolver: zodResolver(activateUserSchema),
		defaultValues: {
			username: username,
			password: "",
			password_confirmation: "",
		},
	});

	function onSubmit(data: ActivateUserPayload) {
		activateUser({
			payload: {
				activation_token: token,
				name: data.username,
				password: data.password,
			},
			userId: user,
		});
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup className="gap-4">
				<Controller
					name="username"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="username">Username</FieldLabel>
							<Input
								{...field}
								id="username"
								placeholder="john"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					name="password"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								{...field}
								id="password"
								type="password"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					name="password_confirmation"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="password_confirmation">
								Confirm password
							</FieldLabel>
							<Input
								{...field}
								id="password_confirmation"
								type="password"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Button disabled={isActivationFlowPending} type="submit">
					Activate User
				</Button>
			</FieldGroup>
		</form>
	);
}
