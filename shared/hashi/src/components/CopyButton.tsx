import { Check, Copy } from "lucide-react";
import {
	IconButton,
	type IconButtonProps,
} from "@zenml/hashi/primitives/icon-button";
import { useCopy } from "@zenml/hashi/hooks/use-copy";

type CopyButtonProps = Omit<IconButtonProps, "icon" | "label" | "onClick"> & {
	/** Text written to the clipboard. */
	text: string;
	/** Tooltip label when idle. */
	label?: string;
	/** Tooltip label shown briefly after a successful copy. */
	copiedLabel?: string;
	/** How long the copied state stays before resetting. */
	resetDelayMs?: number;
};

/** Icon button that copies `text` to the clipboard, with tooltip feedback. */
export function CopyButton({
	text,
	label = "Copy to clipboard",
	copiedLabel = "Copied!",
	resetDelayMs = 1500,
	...rest
}: CopyButtonProps) {
	const { copied, copy } = useCopy();

	return (
		<IconButton
			icon={
				copied ? (
					<Check className="text-success size-3.5" />
				) : (
					<Copy className="size-3.5" />
				)
			}
			label={copied ? copiedLabel : label}
			onClick={() => copy(text, { delay: resetDelayMs })}
			{...rest}
		/>
	);
}
