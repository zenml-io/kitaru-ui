import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	createUserSchema,
	type CreateUserFormType,
} from "../business-logic/create-user-schema";
import { useCreateUser } from "../business-logic/use-create-user";
import { userQueryKeys } from "../business-logic/user-queries";
import type { CreateUserDialogSuccess } from "../domain/users";

type CreateUserFormProps = {
	onSuccess: (data: CreateUserDialogSuccess) => void;
};

export function CreateUserFormContainer({ onSuccess }: CreateUserFormProps) {
	const queryClient = useQueryClient();
	const form = useForm<CreateUserFormType>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			username: "",
			isAdmin: false,
		},
	});

	const { createUser, isPending } = useCreateUser({
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
			onSuccess(data);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	function handleFormSubmit(data: CreateUserFormType) {
		createUser({
			name: data.username,
			is_admin: data.isAdmin,
		});
	}

	return (
		<form onSubmit={form.handleSubmit(handleFormSubmit)}>
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
					name="isAdmin"
					control={form.control}
					render={({ field: { value, onChange, ...rest }, fieldState }) => (
						<Field orientation="horizontal" data-invalid={fieldState.invalid}>
							<Switch
								checked={value}
								onCheckedChange={onChange}
								{...rest}
								id="isAdmin"
								aria-invalid={fieldState.invalid}
							/>
							<FieldLabel className="w-fit" htmlFor="isAdmin">
								Add user as admin
							</FieldLabel>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Button disabled={isPending} type="submit">
					Invite User
				</Button>
			</FieldGroup>
		</form>
	);
}
