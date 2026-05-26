import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@zenml/hashi/primitives/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import type { Secret } from "../domain/secrets";
import { DeleteSecretAlertDialogContainer } from "./DeleteSecretAlertDialogContainer";

type SecretRowActionsContainerProps = {
	secret: Secret;
};

export function SecretRowActionsContainer({
	secret,
}: SecretRowActionsContainerProps) {
	const [showDelete, setShowDelete] = useState(false);

	return (
		<>
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
