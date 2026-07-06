import type { OnboardingConfig } from "@zenml/hashi/lib/onboarding";
import type { WorkspaceType } from "@zenml/hashi/lib/state-styles";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";

/**
 * Shared Storybook fixtures.
 *
 * This directory is Storybook-only: it is excluded from the package build
 * (`tsconfig.json` `exclude`) and intentionally absent from the `package.json`
 * `exports` map, so nothing here ships to consumers. It only ever runs inside
 * `*.stories.tsx`.
 *
 * The rosters below were previously re-declared verbatim across several story
 * files. They are centralized here so a single edit keeps every story in sync.
 * Stories slice or reshape these locally when they need fewer entries or a
 * different field shape.
 */

// ─── Members ──────────────────────────────────────────────────────────────────

/** Member shape consumed by `MemberAvatarStack` (and the avatar group). */
export interface FixtureMember {
	id: string;
	name: string;
	email: string;
	initials: string;
	tintIndex: number;
}

/**
 * Canonical 18-member roster. The first 6 cover one slot per tint (0–5); the
 * remainder cycle the tints again. `MemberAvatarStack` stories take prefix
 * slices of this (`slice(0, 3)`, `slice(0, 6)`) and the full array for the
 * overflow cases. Tints are positional, matching the original fixtures.
 */
export const MEMBERS: FixtureMember[] = [
	{
		id: "m1",
		name: "Zuri Achermann",
		email: "zuri@zenml.io",
		initials: "ZA",
		tintIndex: 0,
	},
	{
		id: "m2",
		name: "Hamza Tahir",
		email: "hamza@zenml.io",
		initials: "HT",
		tintIndex: 1,
	},
	{
		id: "m3",
		name: "Alex Lenz",
		email: "alex@zenml.io",
		initials: "AL",
		tintIndex: 2,
	},
	{
		id: "m4",
		name: "Safoine El Khamlichi",
		email: "safoine@zenml.io",
		initials: "SE",
		tintIndex: 3,
	},
	{
		id: "m5",
		name: "Martin Schuster",
		email: "martin@zenml.io",
		initials: "MS",
		tintIndex: 4,
	},
	{
		id: "m6",
		name: "Oleg Dubossarsky",
		email: "oleg@zenml.io",
		initials: "OD",
		tintIndex: 5,
	},
	{
		id: "m7",
		name: "Priya Nair",
		email: "priya@zenml.io",
		initials: "PN",
		tintIndex: 0,
	},
	{
		id: "m8",
		name: "Tobias Schreiner",
		email: "tobias@zenml.io",
		initials: "TS",
		tintIndex: 1,
	},
	{
		id: "m9",
		name: "Clara Vogel",
		email: "clara@zenml.io",
		initials: "CV",
		tintIndex: 2,
	},
	{
		id: "m10",
		name: "James O'Brien",
		email: "james@zenml.io",
		initials: "JO",
		tintIndex: 3,
	},
	{
		id: "m11",
		name: "Yuki Tanaka",
		email: "yuki@zenml.io",
		initials: "YT",
		tintIndex: 4,
	},
	{
		id: "m12",
		name: "Leila Hassan",
		email: "leila@zenml.io",
		initials: "LH",
		tintIndex: 5,
	},
	{
		id: "m13",
		name: "Andrei Popescu",
		email: "andrei@zenml.io",
		initials: "AP",
		tintIndex: 0,
	},
	{
		id: "m14",
		name: "Sophia Müller",
		email: "sophia@zenml.io",
		initials: "SM",
		tintIndex: 1,
	},
	{
		id: "m15",
		name: "Diego Reyes",
		email: "diego@zenml.io",
		initials: "DR",
		tintIndex: 2,
	},
	{
		id: "m16",
		name: "Fatima Al-Rashid",
		email: "fatima@zenml.io",
		initials: "FR",
		tintIndex: 3,
	},
	{
		id: "m17",
		name: "Ivan Novak",
		email: "ivan@zenml.io",
		initials: "IN",
		tintIndex: 4,
	},
	{
		id: "m18",
		name: "Mei-Xing Liu",
		email: "mei@zenml.io",
		initials: "ML",
		tintIndex: 5,
	},
];

/**
 * Roster used by the identity-band headers (`ProjectIdentityBand`,
 * `WorkspaceIdentityBand`). It is a distinct set of people from `MEMBERS` — kept
 * separate so each story renders exactly the names it always has — but shares
 * the same `FixtureMember` shape.
 */
export const IDENTITY_MEMBERS: FixtureMember[] = [
	{
		id: "u1",
		name: "Hamza Tahir",
		email: "hamza@zenml.io",
		initials: "HT",
		tintIndex: 0,
	},
	{
		id: "u2",
		name: "Adam Probst",
		email: "adam@zenml.io",
		initials: "AP",
		tintIndex: 1,
	},
	{
		id: "u3",
		name: "Alex Strick",
		email: "alex@zenml.io",
		initials: "AS",
		tintIndex: 2,
	},
	{
		id: "u4",
		name: "Baris Can",
		email: "baris@zenml.io",
		initials: "BC",
		tintIndex: 3,
	},
	{
		id: "u5",
		name: "Stefan Nica",
		email: "stefan@zenml.io",
		initials: "SN",
		tintIndex: 4,
	},
	{
		id: "u6",
		name: "Michael Schuster",
		email: "michael@zenml.io",
		initials: "MS",
		tintIndex: 5,
	},
];

// ─── Workspaces ───────────────────────────────────────────────────────────────

/** Workspace shape consumed by the switcher stories (richest superset). */
export interface FixtureWorkspace {
	slug: string;
	name: string;
	type: WorkspaceType;
	version: string;
	memberCount: number;
}

/**
 * Canonical workspace roster for the breadcrumb switcher stories. The three
 * ZenML workspaces come first (so `SwitcherPill` / `SwitcherDropdownMenu` can
 * take prefix slices), then the extra staging workspace, then the two Kitaru
 * workspaces. `WorkspaceSwitcherPill` filters out `ml-platform-staging` to
 * reproduce its original mixed ZenML+Kitaru list.
 */
export const WORKSPACES: FixtureWorkspace[] = [
	{
		slug: "zenml-eu-central",
		name: "zenml-eu-central",
		type: "zenml",
		version: "0.84.1",
		memberCount: 8,
	},
	{
		slug: "zenml-us-east",
		name: "zenml-us-east",
		type: "zenml",
		version: "0.84.1",
		memberCount: 5,
	},
	{
		slug: "research-sandbox",
		name: "research-sandbox",
		type: "zenml",
		version: "0.83.0",
		memberCount: 2,
	},
	{
		slug: "ml-platform-staging",
		name: "ml-platform-staging",
		type: "zenml",
		version: "0.84.0",
		memberCount: 11,
	},
	{
		slug: "kitaru-prod",
		name: "kitaru-prod",
		type: "kitaru",
		version: "1.2.0",
		memberCount: 12,
	},
	{
		slug: "kitaru-staging",
		name: "kitaru-staging",
		type: "kitaru",
		version: "1.2.0",
		memberCount: 4,
	},
];

// ─── Timeline ─────────────────────────────────────────────────────────────────

// Status → bar/label treatment for the span tree below. Kept as literal class
// strings (Tailwind can't see computed ones) and reused so every timeline story
// paints the same colors: completed = success, running = warning bar + pulse,
// failed = destructive, cached/reused = a dim muted bar. The status reads from
// the bar color (and the pulse), never from the tiny duration label alone — so
// the shared fixture stays contrast-clean at the 10px label size. Stories that
// want the receded `nameCellClassName` treatment opt into it locally.
const TIMELINE_COMPLETED = { colorClass: "bg-success" } as const;
const TIMELINE_RUNNING = {
	colorClass: "bg-warning",
	pulseMarker: true,
	durationLabel: "running",
} as const;
const TIMELINE_FAILED = { colorClass: "bg-destructive" } as const;
const TIMELINE_CACHED = {
	colorClass: "bg-muted-foreground/40",
	accent: "muted",
} as const;

/**
 * A realistic ML workflow span tree shared by every timeline story
 * (`TimelineWaterfall`, `TimelineRow`, `TimelineAxis`, `TimelineMinimap`,
 * `TimelineGapStripe`, `TimelineMarker`). It captures one live run of a
 * document-classification flow: ingest → chunk & embed → (queued for a GPU) →
 * train → evaluate → deploy.
 *
 * Statuses are spread across the tree so a single fixture exercises the whole
 * status ramp — completed (success), cached/reused (muted), running (warning +
 * pulse), and failed (destructive). Like the rosters above it is a presentation
 * sample, not a validated execution DAG. `colorClass` / `accent` are baked in so
 * the stories share one source of truth; stories that demo the `badge` /
 * `nameBadge` slots add that JSX locally.
 *
 * The ~90s `await_gpu` node sets `collapsesToGap`, so `buildTimeMap` renders it
 * as a warning-toned pause stripe instead of a row — the gap the axis, minimap,
 * and gap-stripe stories rely on.
 */
export const TIMELINE_NODES: TimelineNode[] = [
	{
		id: "ingest_documents",
		label: "ingest_documents",
		startMs: 0,
		durationMs: 4200,
		expanded: true,
		children: [
			{
				id: "fetch_from_s3",
				label: "fetch_from_s3",
				startMs: 0,
				durationMs: 1800,
				children: [],
				...TIMELINE_COMPLETED,
			},
			{
				id: "validate_schema",
				label: "validate_schema",
				startMs: 1800,
				durationMs: 2400,
				children: [],
				...TIMELINE_COMPLETED,
			},
		],
		...TIMELINE_COMPLETED,
	},
	{
		id: "chunk_and_embed",
		label: "chunk_and_embed",
		startMs: 4200,
		durationMs: 11000,
		expanded: true,
		children: [
			{
				id: "split_text",
				label: "split_text",
				startMs: 4200,
				durationMs: 2000,
				children: [],
				...TIMELINE_COMPLETED,
			},
			{
				id: "embed_batches",
				label: "embed_batches",
				startMs: 6200,
				durationMs: 9000,
				children: [],
				...TIMELINE_CACHED,
			},
		],
		...TIMELINE_COMPLETED,
	},
	{
		id: "await_gpu",
		label: "await_gpu",
		startMs: 15200,
		durationMs: 90000,
		children: [],
		colorClass: "bg-warning",
		collapsesToGap: true,
		gapLabel: "Queued for GPU",
		gapTone: "warning",
		gapDescription: "Waiting for an available A100 in the training pool.",
	},
	{
		id: "train_classifier",
		label: "train_classifier",
		startMs: 105200,
		durationMs: 53000,
		expanded: true,
		children: [
			{
				id: "epoch_1",
				label: "epoch_1",
				startMs: 105200,
				durationMs: 25000,
				children: [],
				...TIMELINE_COMPLETED,
			},
			{
				id: "epoch_2",
				label: "epoch_2",
				startMs: 130200,
				durationMs: 28000,
				children: [],
				...TIMELINE_RUNNING,
			},
		],
		...TIMELINE_RUNNING,
	},
	{
		id: "evaluate_model",
		label: "evaluate_model",
		startMs: 158200,
		durationMs: 6700,
		children: [],
		...TIMELINE_FAILED,
	},
	{
		id: "deploy_endpoint",
		label: "deploy_endpoint",
		startMs: 164900,
		durationMs: 4200,
		children: [],
		...TIMELINE_CACHED,
	},
];

// A dense synthetic trace (120 flat spans) for the density edge cases the
// shared tree is intentionally too small to reach: the minimap compresses its
// bar pitch beyond ~37 rows, and the waterfall auto-zooms past 100 rows.
export const DENSE_TIMELINE_NODES: TimelineNode[] = Array.from(
	{ length: 120 },
	(_, i) => ({
		id: `span_${i}`,
		label: `span_${i}`,
		startMs: i * 900,
		durationMs: 700 + (i % 5) * 400,
		children: [],
		colorClass: ["bg-success", "bg-warning", "bg-info", "bg-primary"][i % 4]!,
	})
);

// ─── Onboarding ───────────────────────────────────────────────────────────────

// Mirrors the real Kitaru "get your first flow running" onboarding so the
// checklist and widget stories exercise the same `lib/onboarding` code path the
// app does. `getOnboardingSetup(state, ONBOARDING_STEPS)` turns a list of
// completed step ids into per-item state (completed / active / skipped) plus the
// aggregate `itemsDone` / `totalItems`. The workspace-created step is implicit
// (`implicitCompletedSteps: 1`), so a fresh account already reads "1 of 5".

/** The always-complete, implicit first step shown above the tracked steps. */
export const ONBOARDING_WORKSPACE_TITLE = "Create your Kitaru workspace";

export const ONBOARDING_STEPS = {
	steps: [
		"project_created",
		"stack_with_remote_artifact_store_created",
		"device_verified",
		"pipeline_run_with_remote_artifact_store",
	] as const,
	implicitCompletedSteps: 1,
	// Kitaru has no separate completion marker; the terminal pipeline-run step
	// doubles as the finished signal so completed users are not re-prompted.
	finalStep: "pipeline_run_with_remote_artifact_store",
} satisfies OnboardingConfig<string>;

export type OnboardingStep = (typeof ONBOARDING_STEPS.steps)[number];

/** Human titles for each tracked step, keyed by step id. */
export const ONBOARDING_STEP_TITLES: Record<OnboardingStep, string> = {
	project_created: "Create a new project",
	stack_with_remote_artifact_store_created:
		"Create a home for your artifacts and logs",
	device_verified: "Get set up locally",
	pipeline_run_with_remote_artifact_store: "Run your first pipeline",
};
