import { useRef } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { withTheme } from "@rjsf/core";
import type RjsfForm from "@rjsf/core";
import { Theme as shadcnTheme } from "@rjsf/shadcn";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Send, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/styles";

const Form = withTheme(shadcnTheme);

const UI_SCHEMA = {
	"ui:submitButtonOptions": { norender: true },
	"ui:title": "",
	"ui:description": "",
};

const EMPTY_SCHEMA: RJSFSchema = {};

export function InvokeDrawer({
	open,
	onOpenChange,
	title,
	schema,
	isSubmitting,
	onSubmit,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	schema: RJSFSchema | undefined;
	isSubmitting?: boolean;
	onSubmit: (parameters: Record<string, unknown>) => void;
}) {
	const formRef = useRef<RjsfForm>(null);
	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Backdrop
					className={cn(
						"data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
						"fixed inset-0 z-40 bg-black/20 supports-backdrop-filter:backdrop-blur-xs"
					)}
				/>
				<DialogPrimitive.Popup
					className={cn(
						"bg-background fixed top-0 right-0 bottom-0 z-50",
						"flex w-full max-w-md flex-col shadow-lg outline-none",
						"data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right"
					)}
				>
					<div className="border-border flex items-center justify-between border-b px-4 py-3">
						<DialogPrimitive.Title className="text-sm font-semibold">
							{title}
						</DialogPrimitive.Title>
						<DialogPrimitive.Close
							render={<Button variant="ghost" size="icon-sm" />}
						>
							<X className="size-4" />
							<span className="sr-only">Close</span>
						</DialogPrimitive.Close>
					</div>
					<div className="flex-1 overflow-y-auto p-4">
						<div className="text-xs [&_button]:text-xs [&_input]:text-xs [&_label]:text-xs">
							<Form
								ref={formRef}
								schema={schema ?? EMPTY_SCHEMA}
								validator={validator}
								uiSchema={UI_SCHEMA}
								onSubmit={({ formData }) => onSubmit(formData ?? {})}
							/>
						</div>
					</div>
					<div className="border-border flex gap-2 border-t px-4 py-3">
						<Button
							variant="outline"
							size="sm"
							className="flex-1"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="flex-1"
							disabled={isSubmitting}
							onClick={() => formRef.current?.submit()}
						>
							<Send className="size-3.5" />
							{isSubmitting ? "Invoking…" : "Invoke"}
						</Button>
					</div>
				</DialogPrimitive.Popup>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
