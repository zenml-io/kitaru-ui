import { ArrowLeft, KeyRound } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { CardHeader } from "@/shared/ui/card";

import type { Secret } from "../domain/secrets";

type SecretDetailHeaderProps = {
	secret: Secret;
	onBack: () => void;
	onEdit: () => void;
	onDelete: () => void;
};

export function SecretDetailHeader({
	secret,
	onBack,
	onEdit,
	onDelete,
}: SecretDetailHeaderProps) {
	return (
		<CardHeader className="flex flex-col gap-4">
			<Button
				type="button"
				variant="ghost"
				className="-ml-2 self-start"
				onClick={onBack}
			>
				<ArrowLeft className="size-4" />
				Secrets
			</Button>
			<div className="flex w-full items-start justify-between gap-4">
				<div className="flex min-w-0 flex-col gap-1">
					<h1 className="text-lg font-semibold">{secret.name}</h1>
					<div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
						<span className="font-mono">{secret.shortId}</span>
						<span>{secret.user?.resolvedName ?? "-"}</span>
						<span>{secret.createdAt?.toLocaleString() ?? "-"}</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={onEdit}>
						<KeyRound className="size-4" />
						Edit Keys
					</Button>
					<Button variant="destructive" onClick={onDelete}>
						Delete secret
					</Button>
				</div>
			</div>
		</CardHeader>
	);
}
