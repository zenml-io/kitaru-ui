import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	Controller,
	type Control,
	type FieldArrayWithId,
} from "react-hook-form";

import { Button } from "@zenml/hashi/primitives/button";
import { Field, FieldError } from "@/shared/ui/field";
import { Input } from "@zenml/hashi/primitives/input";
import { Label } from "@zenml/hashi/primitives/label";

import type { SecretFormValues } from "../business-logic/secret-form-schema";

type SecretKeyEditorProps = {
	control: Control<SecretFormValues>;
	fields: FieldArrayWithId<SecretFormValues, "keys", "id">[];
	arrayError?: string;
	onAdd: () => void;
	onRemove: (index: number) => void;
};

export function SecretKeyEditor({
	control,
	fields,
	arrayError,
	onAdd,
	onRemove,
}: SecretKeyEditorProps) {
	const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
	const canRemove = fields.length > 1;

	function toggleVisibility(id: string) {
		setVisibleIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	return (
		<div className="flex flex-col gap-3">
			<Label>Keys</Label>
			<div className="text-muted-foreground grid grid-cols-[1fr_1fr_72px] items-center gap-2 text-xs">
				<span>Key</span>
				<span>Value</span>
				<span aria-hidden="true" />
			</div>
			{fields.map((field, index) => {
				const isLast = index === fields.length - 1;
				const isVisible = visibleIds.has(field.id);
				return (
					<div
						key={field.id}
						className="grid grid-cols-[1fr_1fr_72px] items-start gap-2"
					>
						<Controller
							control={control}
							name={`keys.${index}.key`}
							render={({ field: f, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<Input
										{...f}
										placeholder="Key"
										autoComplete="off"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							control={control}
							name={`keys.${index}.value`}
							render={({ field: f }) => (
								<div className="relative">
									<Input
										{...f}
										placeholder="Value"
										type={isVisible ? "text" : "password"}
										autoComplete="off"
										className="pr-9"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon-xs"
										className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
										aria-label={isVisible ? "Hide value" : "Show value"}
										onClick={() => toggleVisibility(field.id)}
									>
										{isVisible ? <EyeOff /> : <Eye />}
									</Button>
								</div>
							)}
						/>
						<div className="flex items-center gap-1 pt-0.5">
							{canRemove && (
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label="Remove key"
									onClick={() => onRemove(index)}
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
			{arrayError && <FieldError errors={[{ message: arrayError }]} />}
		</div>
	);
}
