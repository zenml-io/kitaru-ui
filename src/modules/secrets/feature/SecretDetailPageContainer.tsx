import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { DeleteAlertDialog } from "@/shared/ui/DeleteAlertDialog";
import { Input } from "@/shared/ui/input";

import {
	secretQueries,
	secretQueryKeys,
} from "../business-logic/secret-queries";
import { useUpdateSecret } from "../business-logic/use-update-secret";
import { SecretDetailTable } from "../ui/SecretDetailTable";
import { DeleteSecretAlertDialog } from "./DeleteSecretAlertDialog";
import { EditSecretKeysDialog } from "./EditSecretKeysDialog";

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

	const filteredKeys = useMemo(() => {
		const q = search.toLowerCase();
		return secret.keys.filter((k) => k.key.toLowerCase().includes(q));
	}, [secret.keys, search]);

	const { updateSecret, isPending: isRemovingKey } = useUpdateSecret({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			setKeyToDelete(undefined);
			toast.success("Key removed");
		},
		onError: (error) => toast.error(error.message),
	});

	function removeKey(keyName: string) {
		const remaining = secret.keys.filter((k) => k.key !== keyName);
		updateSecret({ secretId: secret.id, payload: { keys: remaining } });
	}

	return (
		<Card>
			<CardHeader className="flex flex-col gap-4">
				<Button
					type="button"
					variant="ghost"
					className="-ml-2 self-start"
					onClick={() => navigate({ to: "/settings/secrets" })}
				>
					<ArrowLeft className="size-4" />
					Secrets
				</Button>
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h1 className="text-lg font-semibold">{secret.name}</h1>
						<span className="text-muted-foreground font-mono text-xs">
							{secret.shortId}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="outline" onClick={() => setEditOpen(true)}>
							<KeyRound className="size-4" />
							Edit Keys
						</Button>
						<Button
							variant="destructive"
							onClick={() => setDeleteSecretOpen(true)}
						>
							Delete secret
						</Button>
					</div>
				</div>
			</CardHeader>
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
				<EditSecretKeysDialog
					secret={secret}
					open={editOpen}
					onOpenChange={setEditOpen}
				/>
			)}
			{deleteSecretOpen && (
				<DeleteSecretAlertDialog
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
