import { Button } from "@zenml/hashi/primitives/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@zenml/hashi/primitives/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import {
	UpdateProfileFormSchema,
	type UpdateProfileForm,
} from "../business-logic/update-user-form-schema";
import { useUpdateCurrentUser } from "../business-logic/use-update-current-user";
import { userQueries, userQueryKeys } from "../business-logic/user-queries";
import { toast } from "sonner";

export function UpdateCurrentUserFormContainer() {
	const { data } = useSuspenseQuery(userQueries.currentUser());
	const queryClient = useQueryClient();
	const { current } = userQueryKeys;
	const { updateCurrentUser, isPending: isMutationPending } =
		useUpdateCurrentUser({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: current });
				toast.success("Profile updated successfully");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	const form = useForm<UpdateProfileForm>({
		resolver: zodResolver(UpdateProfileFormSchema),
		defaultValues: {
			fullName: data.fullName ?? "",
			username: data.name ?? "",
			email: data.email ?? "",
		},
	});

	function onSubmit(data: UpdateProfileForm) {
		updateCurrentUser({
			full_name: data.fullName,
			name: data.username,
			email: data.email,
		});
	}

	return (
		<form className="max-w-sm" onSubmit={form.handleSubmit(onSubmit)}>
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
								placeholder="admin"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					name="fullName"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="fullName">Full name</FieldLabel>
							<Input
								{...field}
								id="fullName"
								placeholder="John Doe"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								{...field}
								id="email"
								placeholder="you@company.com"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Button
					className="w-fit"
					disabled={!form.formState.isValid || isMutationPending}
					type="submit"
				>
					Save Changes
				</Button>
			</FieldGroup>
		</form>
	);
}
