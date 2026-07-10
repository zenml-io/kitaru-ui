import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// Layout guard for the folder-per-component structure: every component's
// files (source + stories + Code Connect + specs) live together in a folder
// named after the component — `primitives/button/button.tsx`,
// `components/AppNavbar/AppNavbar.stories.tsx` — sitting DIRECTLY under its
// root. A directory is a component folder iff it directly contains
// `<dirname>.tsx`. Nested "family" directories are not allowed: the single
// wildcard in package.json `exports` and figma.config.json `importPaths`
// only reaches one folder level, so a nested dir either breaks resolution
// (repeated-`*` exports targets double-substitute the extra segment) or
// silently drops the segment from published Code Connect imports. Group
// related components in Storybook titles (`Components/Timeline/...`), not
// on the filesystem.

const src = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgRoot = join(src, "..");
const ROOTS = ["primitives", "components"] as const;

type Entry = { name: string; isDir: boolean };

const list = (dir: string): Entry[] =>
	readdirSync(dir, { withFileTypes: true }).map((e) => ({
		name: e.name,
		isDir: e.isDirectory(),
	}));

// Vitest browser mode drops failure screenshots next to the failing spec —
// tolerated inside component folders so one red test doesn't poison every
// later run with bogus layout failures.
const TEST_ARTIFACT_DIRS = new Set(["__screenshots__", "__snapshots__"]);

// iCloud sync-conflict duplicates ("button 2.tsx") must never be committed.
const ICLOUD_DUPE = / \d+\.[^.]+$/;

const isComponentFolder = (dir: string, name: string) =>
	list(dir).some((e) => !e.isDir && e.name === `${name}.tsx`);

for (const root of ROOTS) {
	describe(`${root}: folder-per-component layout`, () => {
		const rootDir = join(src, root);

		const checkComponentFolder = (dir: string, name: string, label: string) => {
			it(`${label} is a well-formed component folder`, () => {
				const entries = list(dir);
				const subdirs = entries
					.filter((e) => e.isDir && !TEST_ARTIFACT_DIRS.has(e.name))
					.map((e) => e.name);
				expect(subdirs, `${label} must not contain subdirectories`).toEqual([]);
				for (const e of entries) {
					if (!e.name.endsWith(".tsx")) continue;
					const component = e.name.split(".")[0];
					expect(
						component,
						`${label}/${e.name} does not belong to component "${name}" — same-basename files only`
					).toBe(name);
				}
			});
		};

		for (const entry of list(rootDir)) {
			const label = `src/${root}/${entry.name}`;

			if (!entry.isDir) {
				it(`${label} is not a loose component file`, () => {
					expect(
						entry.name.endsWith(".tsx"),
						`${label} must live in a per-component folder (src/${root}/<Name>/${entry.name})`
					).toBe(false);
				});
				continue;
			}

			const dir = join(rootDir, entry.name);
			it(`${label} is a component folder`, () => {
				expect(
					isComponentFolder(dir, entry.name),
					`${label} is not a component folder (<Name>/<Name>.tsx). Nested family directories are not supported — the exports/importPaths wildcards reach exactly one folder level. Group related components via Storybook titles instead.`
				).toBe(true);
			});
			if (isComponentFolder(dir, entry.name)) {
				checkComponentFolder(dir, entry.name, label);
			}
		}
	});
}

describe("iCloud sync-conflict artifacts", () => {
	// Scans the package's tracked content dirs, not just src/ — the real-world
	// dupes land next to config files (.storybook/"main 2.ts") too.
	const SCAN_DIRS = ["src", ".storybook", "docs"];
	it("package contains no ' N.' duplicate basenames", () => {
		const dupes: string[] = [];
		for (const d of SCAN_DIRS) {
			const entries = readdirSync(join(pkgRoot, d), {
				recursive: true,
				encoding: "utf8",
			});
			dupes.push(
				...entries.filter((e) => ICLOUD_DUPE.test(e)).map((e) => `${d}/${e}`)
			);
		}
		const topLevel = list(pkgRoot)
			.filter((e) => !e.isDir && ICLOUD_DUPE.test(e.name))
			.map((e) => e.name);
		dupes.push(...topLevel);
		expect(
			dupes,
			`iCloud duplicate files must be deleted, never committed: ${dupes.join(", ")}`
		).toEqual([]);
	});
});
