import { MonacoJsonSchemaEditor } from "@/modules/monaco/ui/MonacoJsonSchemaEditor";
import { Button } from "@/shared/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/sheet";
import { isRecord } from "@/shared/utils/is-record";
import { Loader2, Play, Send, X } from "lucide-react";
import { useState } from "react";

export function InvokeSheet({
	open,
	onOpenChange,
	title,
	defaultValue = "{}",
	isLoading,
	isSubmitting,
	onSubmit,
	jsonSchema,
	disabled,
	snapshotId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	defaultValue?: string;
	isLoading?: boolean;
	isSubmitting?: boolean;
	jsonSchema?: Record<string, unknown>;
	snapshotId: string;
	disabled?: boolean;
	onSubmit: (parameters: Record<string, unknown>) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetTrigger
				render={
					<Button type="button" size="sm" disabled={disabled}>
						<Play className="size-3.5" />
						Invoke
					</Button>
				}
			/>
			<SheetContent className="sm:max-w-1/2" showCloseButton={false}>
				<div className="border-border flex items-center justify-between border-b px-4 py-3">
					<SheetTitle className="text-sm font-semibold">{title}</SheetTitle>
					<SheetClose render={<Button variant="ghost" size="icon-sm" />}>
						<X className="size-4" />
						<span className="sr-only">Close</span>
					</SheetClose>
				</div>
				{isLoading ? (
					<div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 text-xs">
						<Loader2 className="size-3.5 animate-spin" />
						Loading parameters…
					</div>
				) : (
					<ParametersEditor
						jsonSchema={jsonSchema}
						snapshotId={snapshotId}
						key={defaultValue}
						defaultValue={defaultValue}
						isSubmitting={isSubmitting}
						onSubmit={onSubmit}
						onCancel={() => onOpenChange(false)}
					/>
				)}
			</SheetContent>
		</Sheet>
	);
}

function ParametersEditor({
	defaultValue,
	isSubmitting,
	onSubmit,
	onCancel,
	jsonSchema,
	snapshotId,
}: {
	defaultValue: string;
	isSubmitting?: boolean;
	onSubmit: (parameters: Record<string, unknown>) => void;
	onCancel: () => void;
	jsonSchema?: Record<string, unknown>;
	snapshotId: string;
}) {
	const [value, setValue] = useState(defaultValue);

	function handleInvoke() {
		const parsed = JSON.parse(value);
		if (!isRecord(parsed)) return null;
		onSubmit(parsed);
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
				<label htmlFor="invoke-parameters" className="text-xs font-medium">
					Parameters (YAML)
				</label>

				<MonacoJsonSchemaEditor
					className="h-full"
					jsonSchema={jsonSchema}
					schemaId={snapshotId}
					defaultValue={defaultValue}
					onChange={(value) => setValue(value ?? defaultValue)}
				/>
			</div>
			<div className="border-border flex gap-2 border-t px-4 py-3">
				<Button
					variant="outline"
					size="sm"
					className="flex-1"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button
					size="sm"
					className="flex-1"
					disabled={isSubmitting}
					onClick={handleInvoke}
				>
					<Send className="size-3.5" />
					{isSubmitting ? "Invoking…" : "Invoke"}
				</Button>
			</div>
		</>
	);
}
