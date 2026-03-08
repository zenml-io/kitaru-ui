import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearch } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { loginMutationOptions } from "../domain/mutations/login-mutation";
import { loginSchema, type LoginPayload } from "../domain/login-schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function LoginFormContainer() {
	const { next } = useSearch({ from: "/(public)/_mesh/login" });
	const router = useRouter();
	const form = useForm<LoginPayload>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const { mutate, isPending: isMutationPending } = useMutation(
		loginMutationOptions({
			onSuccess: async () => {
				router.navigate({ to: next ?? "/" });
			},
			onError: (err) => {
				toast.error(err.message);
			},
		})
	);

	function onSubmit(data: LoginPayload) {
		mutate(data);
	}

	return (
		<form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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
								placeholder="you@company.com"
								aria-invalid={fieldState.invalid}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										form.setFocus("password");
									}
								}}
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
								placeholder="Enter your password"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Button
					disabled={form.formState.isSubmitting || isMutationPending}
					type="submit"
				>
					Sign in
				</Button>
			</FieldGroup>
		</form>
	);
}
