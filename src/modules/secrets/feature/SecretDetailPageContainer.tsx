import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/shared/ui/card";
import { DeleteAlertDialog } from "@/shared/ui/DeleteAlertDialog";
import { Input } from "@/shared/ui/input";

import {
	secretQueries,
	secretQueryKeys,
} from "../business-logic/secret-queries";
import { useUpdateSecret } from "../business-logic/use-update-secret";
import { SecretDetailHeader } from "../ui/SecretDetailHeader";
import { SecretDetailTable } from "../ui/SecretDetailTable";
import { getErrorMessage } from "../business-logic/get-error-message";
import { DeleteSecretAlertDialogContainer } from "./DeleteSecretAlertDialogContainer";
import { SecretFormDialogContainer } from "./SecretFormDialogContainer";

export function SecretDetailPageContainer() {
	const { secretId } = useParams({
		from: "/_private/_navbar/settings/secrets/$secretId",
	});
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: secret } = useSuspenseQuery(secretQueries.detail(secretId));

	const [editOpen, setEditOpen] = useState(false);
	const [deleteSecretOpen, setDeleteSecretOpen] = useState(false);
	const [keyToDelete, setKeyToDelete] = useState<string | undefined>();
	const [search, setSearch] = useState("");

	const searchQuery = search.toLowerCase();
	const filteredKeys = secret.keys.filter((k) =>
		k.key.toLowerCase().includes(searchQuery)
	);

	const { updateSecret, isPending: isRemovingKey } = useUpdateSecret({
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			setKeyToDelete(undefined);
			toast.success("Key removed");
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not remove key.")),
	});

	function removeKey(keyName: string) {
		const exists = secret.keys.some((k) => k.key === keyName);
		if (!exists) {
			setKeyToDelete(undefined);
			return;
		}
		const remaining = secret.keys.filter((k) => k.key !== keyName);
		if (remaining.length === 0) {
			toast.error("A secret must contain at least one key.");
			return;
		}
		updateSecret({
			secretId: secret.id,
			payload: { name: secret.name, keys: remaining },
		});
	}

	return (
		<Card>
			<SecretDetailHeader
				secret={secret}
				onBack={() => navigate({ to: "/settings/secrets" })}
				onEdit={() => setEditOpen(true)}
				onDelete={() => setDeleteSecretOpen(true)}
			/>
			<CardContent className="space-y-6">
				<Input
					placeholder="Search keys..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:w-48"
				/>
				<SecretDetailTable
					secretName={secret.name}
					keys={filteredKeys}
					onDeleteKey={setKeyToDelete}
				/>
			</CardContent>
			{editOpen && (
				<SecretFormDialogContainer
					mode="edit"
					secret={secret}
					open={editOpen}
					onOpenChange={setEditOpen}
				/>
			)}
			{deleteSecretOpen && (
				<DeleteSecretAlertDialogContainer
					secret={secret}
					open={deleteSecretOpen}
					onOpenChange={setDeleteSecretOpen}
					onDeleted={() => navigate({ to: "/settings/secrets" })}
				/>
			)}
			{keyToDelete !== undefined && (
				<DeleteAlertDialog
					title="Delete key?"
					description={`You're about to remove the key "${keyToDelete}" from this secret.`}
					open
					onOpenChange={(open) => {
						if (!open) setKeyToDelete(undefined);
					}}
					onConfirm={() => removeKey(keyToDelete)}
					isPending={isRemovingKey}
					actionLabel="Delete key"
					pendingLabel="Deleting..."
				/>
			)}
		</Card>
	);
}
