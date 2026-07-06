import { Field, FieldError, FieldGroup, FieldLabel } from "@zenml/shared-kitaru/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@zenml/hashi/primitives/button";
import { Input } from "@zenml/hashi/primitives/input";
import { useKitaruContext } from "@zenml/shared-kitaru/contexts";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	UpdateProfileFormSchema,
	type UpdateProfileForm,
} from "../business-logic/update-user-form-schema";
import { useCurrentUser } from "../business-logic/use-current-user";
import { useUpdateCurrentUser } from "../business-logic/use-update-current-user";
import { userQueryKeys } from "../business-logic/user-queries";

export function UpdateCurrentUserFormContainer() {
	const { scopeKey } = useKitaruContext();
	const { currentUserData: data } = useCurrentUser();
	const queryClient = useQueryClient();
	const { updateCurrentUser, isPending: isMutationPending } =
		useUpdateCurrentUser({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: userQueryKeys.current(scopeKey),
				});
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
