import { MonacoJsonSchemaEditor } from "@/modules/executions/ui/MonacoJsonSchemaEditor";
import type { JsonSchema } from "@/shared/api/domain/json-schema";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play, Send, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export function InvokeSheetContainer({
	open,
	onOpenChange,
	title,
	defaultValue = "{}",
	isSubmitting,
	onSubmit,
	jsonSchema,
	disabled,
	deploymentId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	defaultValue?: string;
	isSubmitting?: boolean;
	jsonSchema?: JsonSchema;
	deploymentId: string;
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
				<ParametersEditor
					jsonSchema={jsonSchema}
					deploymentId={deploymentId}
					key={defaultValue}
					defaultValue={defaultValue}
					isSubmitting={isSubmitting}
					onSubmit={onSubmit}
					onCancel={() => onOpenChange(false)}
				/>
			</SheetContent>
		</Sheet>
	);
}

const invokeFormSchema = z.object({
	config: z
		.string()

		.refine((value) => {
			try {
				JSON.parse(value);
				return true;
			} catch {
				return false;
			}
		}, "Parameters must be valid JSON.")
		.transform((value) => JSON.parse(value)),
});

type InvokeFormType = z.infer<typeof invokeFormSchema>;

function ParametersEditor({
	defaultValue,
	isSubmitting,
	onSubmit,
	onCancel,
	jsonSchema,
	deploymentId,
}: {
	defaultValue?: string;
	isSubmitting?: boolean;
	onSubmit: (parameters: Record<string, unknown>) => void;
	onCancel: () => void;
	jsonSchema?: JsonSchema;
	deploymentId: string;
}) {
	const form = useForm<InvokeFormType>({
		resolver: zodResolver(invokeFormSchema),
		defaultValues: {
			config: defaultValue ?? "",
		},
	});

	function handleSubmit(data: InvokeFormType) {
		onSubmit(data.config);
	}

	return (
		<form
			onSubmit={form.handleSubmit(handleSubmit)}
			className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
		>
			<FieldGroup className="h-full gap-4">
				<Controller
					name="config"
					control={form.control}
					render={({ field: { value, onChange }, fieldState }) => (
						<Field className="h-full" data-invalid={fieldState.invalid}>
							<FieldLabel>Parameters (JSON)</FieldLabel>
							<MonacoJsonSchemaEditor
								className="h-full"
								jsonSchema={jsonSchema}
								schemaId={deploymentId}
								value={value}
								onChange={onChange}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<div className="border-border flex gap-2 border-t py-3">
					<Button
						variant="outline"
						size="sm"
						type="button"
						className="flex-1"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button
						size="sm"
						className="flex-1"
						type="submit"
						disabled={isSubmitting}
					>
						<Send className="size-3.5" />
						{isSubmitting ? "Invoking…" : "Invoke"}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
}
