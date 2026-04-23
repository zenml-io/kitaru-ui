import { useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Loader2, Send, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { isRecord } from "@/shared/utils/is-record";
import { cn } from "@/shared/utils/styles";

export function InvokeDrawer({
	open,
	onOpenChange,
	title,
	defaultValue = "{}",
	isLoading,
	isSubmitting,
	onSubmit,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	defaultValue?: string;
	isLoading?: boolean;
	isSubmitting?: boolean;
	onSubmit: (parameters: Record<string, unknown>) => void;
}) {
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
					{isLoading ? (
						<div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 text-xs">
							<Loader2 className="size-3.5 animate-spin" />
							Loading parameters…
						</div>
					) : (
						<ParametersEditor
							key={defaultValue}
							defaultValue={defaultValue}
							isSubmitting={isSubmitting}
							onSubmit={onSubmit}
							onCancel={() => onOpenChange(false)}
						/>
					)}
				</DialogPrimitive.Popup>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

function ParametersEditor({
	defaultValue,
	isSubmitting,
	onSubmit,
	onCancel,
}: {
	defaultValue: string;
	isSubmitting?: boolean;
	onSubmit: (parameters: Record<string, unknown>) => void;
	onCancel: () => void;
}) {
	const [value, setValue] = useState(defaultValue);
	const [error, setError] = useState<string | null>(null);

	function handleInvoke() {
		const parsed = safeJsonParse(value);
		if (!isRecord(parsed)) {
			setError("Parameters must be a JSON object.");
			return;
		}
		setError(null);
		onSubmit(parsed);
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
				<label htmlFor="invoke-parameters" className="text-xs font-medium">
					Parameters (JSON)
				</label>
				<textarea
					id="invoke-parameters"
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
						if (error) setError(null);
					}}
					spellCheck={false}
					className={cn(
						"border-border bg-background min-h-48 flex-1 rounded-md border p-2",
						"font-mono text-xs leading-relaxed",
						"focus-visible:ring-ring outline-none focus-visible:ring-2",
						error && "border-destructive focus-visible:ring-destructive"
					)}
				/>
				{error ? (
					<p className="text-destructive text-xs">{error}</p>
				) : (
					<p className="text-muted-foreground text-xs">
						Sent as{" "}
						<code className="font-mono">run_configuration.parameters</code>.
					</p>
				)}
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

function safeJsonParse(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}
