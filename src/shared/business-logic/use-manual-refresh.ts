import { useCallback, useState } from "react";

export function useManualRefresh(refreshFn: () => Promise<unknown>) {
	const [isPending, setIsPending] = useState(false);
	const refresh = useCallback(async () => {
		setIsPending(true);
		try {
			await refreshFn();
		} finally {
			setIsPending(false);
		}
	}, [refreshFn]);

	return {
		refresh,
		isPending,
	};
}
