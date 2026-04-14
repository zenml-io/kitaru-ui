import { useEffect, useRef, useState } from "react";

export const HIGHLIGHT_MS = 1500;

export function useScrollHighlight() {
	const [highlightedId, setHighlightedId] = useState<string | undefined>();
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	const focus = (id: string) => {
		if (timer.current) clearTimeout(timer.current);
		setHighlightedId(id);
		timer.current = setTimeout(() => setHighlightedId(undefined), HIGHLIGHT_MS);
	};

	return { highlightedId, focus };
}
