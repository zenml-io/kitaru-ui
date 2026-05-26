import { Eye, EyeOff, KeyRound, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@zenml/hashi/primitives/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/Table";

import type { SecretKey } from "../domain/secrets";
import { SecretInfoTooltip } from "./SecretInfoTooltip";

const MAX_MASK_BULLETS = 24;

type SecretDetailTableProps = {
	secretName: string;
	keys: SecretKey[];
	onDeleteKey: (keyName: string) => void;
};

export function SecretDetailTable({
	secretName,
	keys,
	onDeleteKey,
}: SecretDetailTableProps) {
	const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

	function toggleKeyVisibility(keyName: string) {
		setVisibleKeys((prev) => {
			const next = new Set(prev);
			if (next.has(keyName)) next.delete(keyName);
			else next.add(keyName);
			return next;
		});
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-1/3">Key</TableHead>
					<TableHead>Value</TableHead>
					<TableHead className="w-[50px]">
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{keys.length === 0 ? (
					<TableRow>
						<TableCell colSpan={3} className="h-24 text-center">
							This secret has no keys.
						</TableCell>
					</TableRow>
				) : (
					keys.map((row) => {
						const isVisible = visibleKeys.has(row.key);
						const maskLength = Math.min(row.value.length, MAX_MASK_BULLETS);
						return (
							<TableRow key={row.key}>
								<TableCell>
									<div className="flex items-center gap-2">
										<KeyRound className="text-primary size-4" />
										<span className="font-mono text-sm">{row.key}</span>
										<SecretInfoTooltip
											secretName={secretName}
											keyName={row.key}
										/>
									</div>
								</TableCell>
								<TableCell className="max-w-0">
									<div className="flex min-w-0 items-center gap-2">
										<Button
											type="button"
											variant="ghost"
											size="icon-xs"
											aria-label={isVisible ? "Hide value" : "Show value"}
											onClick={() => toggleKeyVisibility(row.key)}
										>
											{isVisible ? <EyeOff /> : <Eye />}
										</Button>
										<span className="text-muted-foreground min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap">
											{isVisible ? row.value : "\u2022".repeat(maskLength)}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex justify-end">
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											aria-label={`Delete key ${row.key}`}
											onClick={() => onDeleteKey(row.key)}
										>
											<Trash2 />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})
				)}
			</TableBody>
		</Table>
	);
}
