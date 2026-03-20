import { useState } from "react";
import { toast } from "sonner";

type UseCopyOptions = {
	delay?: number;
};

export function useCopy(options?: UseCopyOptions) {
	const { delay = 1500 } = options ?? {};
	const [copied, setCopied] = useState(false);

	async function copy(text: string) {
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
