import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import type { CreateUserDialogSuccess } from "../domain/users";
import { CreateUserFormContainer } from "./CreateUserFormContainer";
import { CreateUserSuccessContainer } from "./CreateUserSuccessContainer";

export function CreateUserDialogContainer() {
	const [open, setOpen] = useState(false);
	const [successState, setSuccessState] =
		useState<CreateUserDialogSuccess | null>(null);

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);
		if (!nextOpen) {
			setSuccessState(null);
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger render={<Button />}>
				<UserPlus className="size-4" />
				Create User
			</DialogTrigger>
			<CreateUserDialogContent
				successState={successState}
				onSuccess={setSuccessState}
			/>
		</Dialog>
	);
}

type CreateUserDialogContentProps = {
	successState: CreateUserDialogSuccess | null;
	onSuccess: (data: CreateUserDialogSuccess) => void;
};

function CreateUserDialogContent({
	successState,
	onSuccess,
}: CreateUserDialogContentProps) {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="text-lg font-semibold">
					Invite a new member
				</DialogTitle>
				<DialogDescription>
					Send an invitation to join Kitaru.
				</DialogDescription>
			</DialogHeader>
			{successState ? (
				<CreateUserSuccessContainer
					username={successState.username}
					userId={successState.userId}
					activationToken={successState.activationToken}
				/>
			) : (
				<CreateUserFormContainer onSuccess={onSuccess} />
			)}
		</DialogContent>
	);
}
