import { Field, FieldError, FieldGroup, FieldLabel } from "@zenml/shared-kitaru/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@zenml/hashi/primitives/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zenml/hashi/primitives/dialog";
import { Input } from "@zenml/hashi/primitives/input";
import { useKitaruContext } from "@zenml/shared-kitaru/contexts";
import { useId, useState, type PropsWithChildren } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	updateAvatarFormSchema,
	type UpdateAvatarFormType,
} from "../business-logic/update-user-avatar-schema";
import { useCurrentUser } from "../business-logic/use-current-user";
import { useUpdateCurrentUser } from "../business-logic/use-update-current-user";
import { userQueryKeys } from "../business-logic/user-queries";

export function UpdateAvatarDialogContainer({ children }: PropsWithChildren) {
	const formId = useId();
	const [open, setOpen] = useState(false);
	const { currentUserData: data } = useCurrentUser();

	const avatarUrl = data.avatarUrl ?? undefined;

	function handleSuccess() {
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="outline" />}>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Avatar</DialogTitle>
				</DialogHeader>
				<UpdateAvatarForm
					avatarUrl={avatarUrl}
					handleSuccess={handleSuccess}
					formId={formId}
				/>
				<DialogFooter>
					<div className="flex items-center gap-2">
						<DialogClose render={<Button variant="secondary" />}>
							Cancel
						</DialogClose>
						<Button type="submit" form={formId}>
							Update
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

type UpdateAvatarFormProps = {
	avatarUrl?: string;
	handleSuccess: () => void;
	formId: string;
};

function UpdateAvatarForm({
	avatarUrl,
	handleSuccess,
	formId,
}: UpdateAvatarFormProps) {
	const queryClient = useQueryClient();
	const { scopeKey } = useKitaruContext();

	const { updateCurrentUser } = useUpdateCurrentUser({
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: userQueryKeys.current(scopeKey),
			});
			handleSuccess();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const form = useForm<UpdateAvatarFormType>({
		resolver: zodResolver(updateAvatarFormSchema),
		defaultValues: {
			avatarUrl: avatarUrl ?? "",
		},
	});

	function onSubmit(data: UpdateAvatarFormType) {
		updateCurrentUser({
			avatar_url: data.avatarUrl || null,
		});
	}

	return (
		<form
			id={formId}
			className="max-w-sm"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<FieldGroup className="gap-4">
				<Controller
					name="avatarUrl"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="avatarUrl">Avatar URL</FieldLabel>
							<Input
								{...field}
								id="avatarUrl"
								placeholder="https://example.com/avatar.jpg"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							<DialogDescription>This will be profile avatar</DialogDescription>
						</Field>
					)}
				/>
			</FieldGroup>
		</form>
	);
}
