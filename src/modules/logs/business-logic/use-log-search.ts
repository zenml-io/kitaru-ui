import { useCallback, useMemo, useState } from "react";
import type { LogEntry } from "../domain/log-entry";

export type SearchRange = { start: number; end: number };
export type SearchMatch = { logIndex: number; range: SearchRange };

type UseLogSearchResult = {
	search: string;
	setSearch: (value: string) => void;
	matchCount: number;
	activeMatchIndex: number;
	activeMatch: SearchMatch | undefined;
	matchesByLogIndex: Map<number, SearchRange[]>;
	nextMatch: () => void;
	prevMatch: () => void;
};

export function useLogSearch(logs: LogEntry[]): UseLogSearchResult {
	const [search, setSearchState] = useState("");
	const [activeMatchIndex, setActiveMatchIndex] = useState(-1);

	const { matches, matchesByLogIndex } = useMemo(() => {
		if (!search) {
			return {
				matches: [] as SearchMatch[],
				matchesByLogIndex: new Map<number, SearchRange[]>(),
			};
		}
		const needle = search.toLowerCase();
		const flat: SearchMatch[] = [];
		const byIndex = new Map<number, SearchRange[]>();
		for (let i = 0; i < logs.length; i++) {
			const haystack = logs[i].message.toLowerCase();
			const ranges: SearchRange[] = [];
			let from = 0;
			while (from <= haystack.length - needle.length) {
				const idx = haystack.indexOf(needle, from);
				if (idx === -1) break;
				const range = { start: idx, end: idx + needle.length };
				ranges.push(range);
				flat.push({ logIndex: i, range });
				from = idx + needle.length;
			}
			if (ranges.length > 0) byIndex.set(i, ranges);
		}
		return { matches: flat, matchesByLogIndex: byIndex };
	}, [logs, search]);

	const setSearch = useCallback((value: string) => {
		setSearchState(value);
		setActiveMatchIndex(value ? 0 : -1);
	}, []);

	const nextMatch = useCallback(() => {
		setActiveMatchIndex((prev) => {
			if (matches.length === 0) return -1;
			const base =
				prev < 0 || prev >= matches.length ? matches.length - 1 : prev;
			return (base + 1) % matches.length;
		});
	}, [matches.length]);

	const prevMatch = useCallback(() => {
		setActiveMatchIndex((prev) => {
			if (matches.length === 0) return -1;
			const base =
				prev < 0 || prev >= matches.length ? matches.length - 1 : prev;
			return (base - 1 + matches.length) % matches.length;
		});
	}, [matches.length]);

	const clampedIndex =
		matches.length === 0
			? -1
			: activeMatchIndex < 0
				? 0
				: activeMatchIndex >= matches.length
					? matches.length - 1
					: activeMatchIndex;
	const activeMatch = clampedIndex >= 0 ? matches[clampedIndex] : undefined;

	return {
		search,
		setSearch,
		matchCount: matches.length,
		activeMatchIndex: clampedIndex,
		activeMatch,
		matchesByLogIndex,
		nextMatch,
		prevMatch,
	};
}
