import { getServerInfoQueryKey } from "@/features/app/domain/queries/server-info-query";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	serverActivationSchema,
	type ServerActivationPayload,
} from "../domain/server-activation-schema";
import { activateServerAndLoginMutationOptions } from "./activate-server-and-login-mutation";

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return "Something went wrong while activating the server";
}

export function ServerActivationForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const form = useForm<ServerActivationPayload>({
		resolver: zodResolver(serverActivationSchema),
		defaultValues: {
			server_name: "My Kitaru Server",
			admin_username: "",
			admin_password: "",
		},
	});

	const { mutate: activateServerAndLogin, isPending: isActivationFlowPending } =
		useMutation(
			activateServerAndLoginMutationOptions({
				onSuccess: async () => {
					await queryClient.invalidateQueries({
						queryKey: getServerInfoQueryKey(),
						refetchType: "all",
					});

					router.navigate({ to: "/" });
				},
				onError: (error) => {
					toast.error(getErrorMessage(error));
				},
			})
		);

	async function onSubmit(data: ServerActivationPayload) {
		activateServerAndLogin(data);
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup className="gap-4">
				<Controller
					name="server_name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="server_name">Server name</FieldLabel>
							<Input
								{...field}
								id="server_name"
								placeholder="My Kitaru Server"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					name="admin_username"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="admin_username">Username</FieldLabel>
							<Input
								{...field}
								id="admin_username"
								placeholder="admin"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					name="admin_password"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="admin_password">Admin password</FieldLabel>
							<Input
								{...field}
								id="admin_password"
								type="password"
								placeholder="Enter admin password"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Button
					disabled={form.formState.isSubmitting || isActivationFlowPending}
					type="submit"
				>
					Activate server
				</Button>
			</FieldGroup>
		</form>
	);
}
