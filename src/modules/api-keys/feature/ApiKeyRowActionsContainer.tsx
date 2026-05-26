import { MoreHorizontal, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@zenml/hashi/primitives/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import type { ApiKey } from "../domain/api-key";
import { DeleteApiKeyAlertDialogContainer } from "./DeleteApiKeyAlertDialogContainer";
import { RotateApiKeyDialogContainer } from "./RotateApiKeyDialogContainer";

type ApiKeyRowActionsContainerProps = {
	serviceAccountId: string;
	apiKey: ApiKey;
};

export function ApiKeyRowActionsContainer({
	serviceAccountId,
	apiKey,
}: ApiKeyRowActionsContainerProps) {
	const [showRotate, setShowRotate] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label={`Open actions for ${apiKey.name}`}
						>
							<MoreHorizontal />
							<span className="sr-only">Open row actions</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem onClick={() => setShowRotate(true)}>
						<RefreshCcw className="size-4" /> Rotate
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setShowDelete(true)}
					>
						<Trash2 className="size-4" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{showRotate && (
				<RotateApiKeyDialogContainer
					serviceAccountId={serviceAccountId}
					apiKey={apiKey}
					open={showRotate}
					onOpenChange={setShowRotate}
				/>
			)}
			{showDelete && (
				<DeleteApiKeyAlertDialogContainer
					serviceAccountId={serviceAccountId}
					apiKey={apiKey}
					open={showDelete}
					onOpenChange={setShowDelete}
				/>
			)}
		</>
	);
}
