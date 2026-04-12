import { describe, expect, it } from "vitest";
import type { MemoryEntry } from "../domain/memory";
import {
	dedupeMemoryEntries,
	deriveScopesFromEntries,
	snapshotMemoryEntriesAtTime,
} from "./memory-operations";

function makeEntry(overrides: Partial<MemoryEntry> = {}): MemoryEntry {
	return {
		key: "counter",
		scope: "my-flow",
		version: "1",
		valueType: "dict",
		scopeType: "flow",
		createdAt: new Date("2024-06-01T10:00:00Z"),
		isDeleted: false,
		artifactId: "av-1",
		...overrides,
	};
}

describe("deriveScopesFromEntries", () => {
	it("keys flow scope by flow id and uses flow name as label", () => {
		const scopes = deriveScopesFromEntries(
			[],
			[
				makeEntry({
					scope: "flow-123",
					scopeLabel: "My Flow",
					artifactId: "av-flow-1",
				}),
			],
			[],
			"flow-123",
			"My Flow"
		);

		expect(scopes).toContainEqual({
			scope: "flow-123",
			label: "My Flow",
			scopeType: "flow",
			entryCount: 1,
		});
	});

	it("adds an empty synthetic flow scope keyed by flow id", () => {
		const scopes = deriveScopesFromEntries(
			[],
			[],
			[],
			"flow-456",
			"Empty Flow"
		);

		expect(scopes).toContainEqual({
			scope: "flow-456",
			label: "Empty Flow",
			scopeType: "flow",
			entryCount: 0,
		});
	});

	it("uses scopeLabel from enriched entries", () => {
		const scopes = deriveScopesFromEntries(
			[],
			[
				makeEntry({
					scope: "flow-1",
					scopeLabel: "My Flow",
					artifactId: "av-1",
				}),
				makeEntry({
					scope: "flow-1",
					scopeLabel: "My Flow",
					key: "other",
					artifactId: "av-2",
				}),
			],
			[],
			"flow-1",
			"My Flow"
		);

		const flowScope = scopes.find(
			(s) => s.scope === "flow-1" && s.scopeType === "flow"
		);
		expect(flowScope?.label).toBe("My Flow");
		expect(flowScope?.entryCount).toBe(2);
	});
});

describe("dedupeMemoryEntries", () => {
	it("keeps the newest version per key (first in newest-first input)", () => {
		const entries = [
			makeEntry({ version: "3", artifactId: "av-3" }),
			makeEntry({ version: "2", artifactId: "av-2" }),
			makeEntry({ version: "1", artifactId: "av-1" }),
		];
		const result = dedupeMemoryEntries(entries);
		expect(result).toHaveLength(1);
		expect(result[0].version).toBe("3");
	});

	it("suppresses keys whose newest version is a tombstone", () => {
		const entries = [
			makeEntry({ version: "2", isDeleted: true }),
			makeEntry({ version: "1", isDeleted: false }),
		];
		expect(dedupeMemoryEntries(entries)).toHaveLength(0);
	});

	it("excludes compaction keys", () => {
		const entries = [
			makeEntry({ key: "_compaction/2024-01-01" }),
			makeEntry({ key: "counter" }),
		];
		const result = dedupeMemoryEntries(entries);
		expect(result).toHaveLength(1);
		expect(result[0].key).toBe("counter");
	});

	it("returns empty for empty input", () => {
		expect(dedupeMemoryEntries([])).toEqual([]);
	});

	it("handles mix of deleted and active entries across keys", () => {
		const entries = [
			makeEntry({ key: "alpha", version: "2", isDeleted: true }),
			makeEntry({ key: "alpha", version: "1", isDeleted: false }),
			makeEntry({ key: "beta", version: "1", isDeleted: false }),
		];
		const result = dedupeMemoryEntries(entries);
		expect(result).toHaveLength(1);
		expect(result[0].key).toBe("beta");
	});
});

describe("snapshotMemoryEntriesAtTime", () => {
	const T1 = new Date("2024-06-01T10:00:00Z");
	const T2 = new Date("2024-06-02T10:00:00Z");
	const T3 = new Date("2024-06-03T10:00:00Z");

	it("returns entry created at cutoff time", () => {
		const entries = [makeEntry({ createdAt: T1, version: "1" })];
		const result = snapshotMemoryEntriesAtTime(entries, T1);
		expect(result).toHaveLength(1);
		expect(result[0].version).toBe("1");
	});

	it("picks the correct older version when key was updated after cutoff", () => {
		const entries = [
			makeEntry({ createdAt: T3, version: "2", artifactId: "av-2" }),
			makeEntry({ createdAt: T1, version: "1", artifactId: "av-1" }),
		];
		const result = snapshotMemoryEntriesAtTime(entries, T2);
		expect(result).toHaveLength(1);
		expect(result[0].version).toBe("1");
		expect(result[0].artifactId).toBe("av-1");
	});

	it("drops key created entirely after cutoff", () => {
		const entries = [makeEntry({ createdAt: T3, version: "1" })];
		const result = snapshotMemoryEntriesAtTime(entries, T2);
		expect(result).toHaveLength(0);
	});

	it("suppresses key whose latest version at cutoff is a tombstone", () => {
		const entries = [
			makeEntry({
				createdAt: T2,
				version: "2",
				isDeleted: true,
			}),
			makeEntry({
				createdAt: T1,
				version: "1",
				isDeleted: false,
			}),
		];
		const result = snapshotMemoryEntriesAtTime(entries, T2);
		expect(result).toHaveLength(0);
	});

	it("shows key whose deletion happened after cutoff", () => {
		const entries = [
			makeEntry({
				createdAt: T3,
				version: "2",
				isDeleted: true,
			}),
			makeEntry({
				createdAt: T1,
				version: "1",
				isDeleted: false,
			}),
		];
		const result = snapshotMemoryEntriesAtTime(entries, T2);
		expect(result).toHaveLength(1);
		expect(result[0].version).toBe("1");
	});

	it("excludes compaction keys", () => {
		const entries = [
			makeEntry({
				key: "_compaction/2024-01-01",
				createdAt: T1,
			}),
			makeEntry({ key: "counter", createdAt: T1 }),
		];
		const result = snapshotMemoryEntriesAtTime(entries, T2);
		expect(result).toHaveLength(1);
		expect(result[0].key).toBe("counter");
	});

	it("returns empty for empty input", () => {
		expect(snapshotMemoryEntriesAtTime([], T1)).toEqual([]);
	});

	it("returns empty when all entries are newer than cutoff", () => {
		const entries = [
			makeEntry({ key: "a", createdAt: T3 }),
			makeEntry({ key: "b", createdAt: T3 }),
		];
		expect(snapshotMemoryEntriesAtTime(entries, T2)).toEqual([]);
	});
});
