import { useEffect, useState } from "react";

export function useNow(enabled: boolean): Date {
	const [now, setNow] = useState(() => new Date());
	useEffect(() => {
		if (!enabled) return;
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, [enabled]);
	return now;
}
