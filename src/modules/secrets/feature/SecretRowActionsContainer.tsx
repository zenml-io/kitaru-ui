import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import type { Secret } from "../domain/secrets";
import { DeleteSecretAlertDialogContainer } from "./DeleteSecretAlertDialogContainer";
import { SecretFormDialogContainer } from "./SecretFormDialogContainer";

type SecretRowActionsContainerProps = {
	secret: Secret;
};

export function SecretRowActionsContainer({
	secret,
}: SecretRowActionsContainerProps) {
	const [showEdit, setShowEdit] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	return (
		<>
			{showEdit && (
				<SecretFormDialogContainer
					mode="edit"
					open={showEdit}
					onOpenChange={setShowEdit}
					secret={secret}
				/>
			)}
			{showDelete && (
				<DeleteSecretAlertDialogContainer
					secret={secret}
					open={showDelete}
					onOpenChange={setShowDelete}
				/>
			)}
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label={`Open actions for ${secret.name}`}
						>
							<MoreHorizontal />
							<span className="sr-only">Open row actions</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem onClick={() => setShowEdit(true)}>
						<Pencil className="size-4" /> Edit keys
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setShowDelete(true)}
					>
						<Trash2 className="size-4" /> Delete secret
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
