import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// Every component and primitive ships with its Figma parity artifacts — a
// colocated Code Connect file (`X.figma.tsx`) pointing at its build in the
// Hashi Design System file — or a recorded `skip` verdict in FIGMA-PARITY.md
// (components with no static visual surface). Map-to-existing components
// carry their own `.figma.tsx` pointing at the existing node, so they pass
// the connect check. This gate fails CI the moment a source file lands with
// neither. Recipe: shared/hashi/CONTRIBUTING.md ("Figma parity").

const src = join(dirname(fileURLToPath(import.meta.url)), "..");

const PARITY_DIRS = ["primitives", "components"] as const;

// Colocated non-component .tsx files that don't need parity artifacts.
const NON_COMPONENT_SUFFIXES = [
	".stories.tsx",
	".figma.tsx",
	".spec.tsx",
	".test.tsx",
	".browser.spec.tsx",
	".browser.test.tsx",
];

// Skip verdicts live in the tracker as rows like
// `| components/TimelineMinimap | skip | - | skipped | ... |`.
const tracker = readFileSync(join(src, "..", "FIGMA-PARITY.md"), "utf8");
const skipRows = new Set(
	[...tracker.matchAll(/^\| ([\w/-]+) \| skip \|/gm)].map((m) => m[1])
);

for (const dir of PARITY_DIRS) {
	describe(`${dir}: figma parity coverage`, () => {
		const root = join(src, dir);
		const entries = readdirSync(root, { recursive: true, encoding: "utf8" });
		const files = entries.map((e) => e.replaceAll("\\", "/"));
		const sources = files.filter(
			(f) =>
				f.endsWith(".tsx") &&
				!NON_COMPONENT_SUFFIXES.some((suffix) => f.endsWith(suffix))
		);
		for (const file of sources) {
			const base = file.replace(/\.tsx$/, "");
			// Tracker rows key components by name, not file path — collapse the
			// per-component folder segment (`Name/Name` -> `Name`) so flat and
			// folder-per-component layouts both match the same row.
			const segments = base.split("/");
			const parityKey =
				segments.length >= 2 && segments.at(-1) === segments.at(-2)
					? segments.slice(0, -1).join("/")
					: base;
			it(`${file} has ${base}.figma.tsx or a skip verdict in FIGMA-PARITY.md`, () => {
				const hasConnect = files.includes(`${base}.figma.tsx`);
				const hasSkipVerdict = skipRows.has(`${dir}/${parityKey}`);
				expect(
					hasConnect || hasSkipVerdict,
					`src/${dir}/${file} has no colocated .figma.tsx and no skip row in FIGMA-PARITY.md. Build the Figma counterpart + Code Connect (or record a skip/map-to-existing verdict) — see shared/hashi/CONTRIBUTING.md.`
				).toBe(true);
			});
		}
	});
}
