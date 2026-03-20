import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useId, useState, type PropsWithChildren } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	updateAvatarFormSchema,
	type UpdateAvatarFormType,
} from "../business-logic/update-user-avatar-schema";
import { useUpdateCurrentUser } from "../business-logic/use-update-current-user";
import { userQueries, userQueryKeys } from "../business-logic/user-queries";

export function UpdateAvatarDialogContainer({ children }: PropsWithChildren) {
	const formId = useId();
	const [open, setOpen] = useState(false);
	const { data } = useSuspenseQuery(userQueries.currentUser());

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
	const { current } = userQueryKeys;

	const { updateCurrentUser } = useUpdateCurrentUser({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: current });
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
