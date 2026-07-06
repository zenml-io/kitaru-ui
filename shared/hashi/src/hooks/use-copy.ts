import { useState } from "react";
import { toast } from "sonner";

type CopyOptions = {
	delay?: number;
};

/**
 * Copies text to the clipboard and exposes a transient `copied` flag for
 * feedback. Surfaces an error toast when the clipboard write is rejected.
 */
export function useCopy() {
	const [copied, setCopied] = useState(false);

	async function copy(text: string, options?: CopyOptions) {
		const { delay = 1500 } = options ?? {};
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), delay);
		} catch {
			toast.error("Failed to copy to clipboard");
		}
	}

	return {
		copied,
		copy,
	};
}
