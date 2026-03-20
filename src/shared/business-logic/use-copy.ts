import { useState } from "react";
import { toast } from "sonner";

type CopyOptions = {
	delay?: number;
};

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
