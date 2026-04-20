import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import type { KeyRow } from "../util/use-key-rows";

type SecretKeyEditorProps = {
	rows: KeyRow[];
	onAdd: () => void;
	onRemove: (id: string) => void;
	onUpdate: (id: string, field: "key" | "value", value: string) => void;
	onToggleVisibility: (id: string) => void;
};

export function SecretKeyEditor({
	rows,
	onAdd,
	onRemove,
	onUpdate,
	onToggleVisibility,
}: SecretKeyEditorProps) {
	const canRemove = rows.length > 1;

	return (
		<div className="flex flex-col gap-3">
			<Label>Keys</Label>
			<div className="text-muted-foreground grid grid-cols-[1fr_1fr_72px] items-center gap-2 text-xs">
				<span>Key</span>
				<span>Value</span>
				<span aria-hidden="true" />
			</div>
			{rows.map((row, index) => {
				const isLast = index === rows.length - 1;
				return (
					<div
						key={row.id}
						className="grid grid-cols-[1fr_1fr_72px] items-center gap-2"
					>
						<Input
							placeholder="Key"
							value={row.key}
							autoComplete="off"
							onChange={(e) => onUpdate(row.id, "key", e.target.value)}
						/>
						<div className="relative">
							<Input
								placeholder="Value"
								type={row.visible ? "text" : "password"}
								value={row.value}
								autoComplete="off"
								onChange={(e) => onUpdate(row.id, "value", e.target.value)}
								className="pr-9"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
								aria-label={row.visible ? "Hide value" : "Show value"}
								onClick={() => onToggleVisibility(row.id)}
							>
								{row.visible ? <EyeOff /> : <Eye />}
							</Button>
						</div>
						<div className="flex items-center justify-end gap-1">
							{canRemove && (
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label="Remove key"
									onClick={() => onRemove(row.id)}
								>
									<Trash2 />
								</Button>
							)}
							{isLast && (
								<Button
									type="button"
									variant="outline"
									size="icon-sm"
									aria-label="Add key"
									onClick={onAdd}
								>
									<Plus />
								</Button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
