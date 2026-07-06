import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// Every component and primitive ships with colocated stories — the Storybook
// IS the design-system reference, and the stories double as browser render +
// axe tests. This gate fails CI the moment a source file lands without them.
// The scan is recursive so subdirectories (e.g. components/timeline/) are
// held to the same rule. Recipe: shared/hashi/CONTRIBUTING.md.

const src = join(dirname(fileURLToPath(import.meta.url)), "..");

const STORY_DIRS = ["primitives", "components"] as const;

// Colocated non-component .tsx files that legitimately ship without stories.
const NON_COMPONENT_SUFFIXES = [
	".stories.tsx",
	".figma.tsx",
	".spec.tsx",
	".test.tsx",
	".browser.spec.tsx",
	".browser.test.tsx",
];

for (const dir of STORY_DIRS) {
	describe(`${dir}: story coverage`, () => {
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
			it(`${file} has ${base}.stories.tsx`, () => {
				expect(
					files.includes(`${base}.stories.tsx`),
					`src/${dir}/${file} has no colocated stories. Add src/${dir}/${base}.stories.tsx — see shared/hashi/CONTRIBUTING.md.`
				).toBe(true);
			});
		}
	});
}
