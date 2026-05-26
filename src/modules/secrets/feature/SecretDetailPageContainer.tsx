import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";

import { Card, CardContent } from "@/shared/ui/card";
import { DeleteAlertDialog } from "@/shared/ui/DeleteAlertDialog";
import { Input } from "@zenml/hashi/primitives/input";

import { secretQueries } from "../business-logic/secret-queries";
import { useRemoveSecretKey } from "../business-logic/use-remove-secret-key";
import { useSecretKeySearch } from "../business-logic/use-secret-key-search";
import { SecretDetailHeader } from "../ui/SecretDetailHeader";
import { SecretDetailTable } from "../ui/SecretDetailTable";
import { DeleteSecretAlertDialogContainer } from "./DeleteSecretAlertDialogContainer";
import { SecretFormDialogContainer } from "./SecretFormDialogContainer";

export function SecretDetailPageContainer() {
	const { secretId } = useParams({
		from: "/_private/_navbar/settings/secrets/$secretId",
	});
	const navigate = useNavigate();
	const { data: secret } = useSuspenseQuery(secretQueries.detail(secretId));

	const [editOpen, setEditOpen] = useState(false);
	const [deleteSecretOpen, setDeleteSecretOpen] = useState(false);

	const { search, setSearch, filteredKeys } = useSecretKeySearch(secret.keys);
	const {
		keyToDelete,
		requestRemove,
		cancelRemove,
		confirmRemove,
		isPending: isRemovingKey,
	} = useRemoveSecretKey(secret);

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
					onDeleteKey={requestRemove}
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
						if (!open) cancelRemove();
					}}
					onConfirm={confirmRemove}
					isPending={isRemovingKey}
					actionLabel="Delete key"
					pendingLabel="Deleting..."
				/>
			)}
		</Card>
	);
}
