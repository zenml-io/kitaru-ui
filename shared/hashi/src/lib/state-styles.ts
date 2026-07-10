// Status / type → className lookup tables shared between the prototype and
// any hashi-promoted UI component. Literal-union inputs are inlined here so
// hashi has no `./types/*` subpath dependency. The unions are kept structurally
// identical to the prototype's `@/types/dashboard` and `@/types/org` exports.

import type { BadgeVariant } from "../primitives/badge/badge";

export type FlowStatus = "active" | "paused" | "error";

export type ExecStatus =
	| "running"
	| "completed"
	| "failed"
	| "cached"
	| "skipped"
	| "retrying"
	| "retried"
	| "paused"
	| "resuming"
	| "stopped"
	| "stopping"
	| "initializing"
	| "provisioning"
	| "waiting"
	| "sleeping"
	| "cancelled";

export type TriggerType = "manual" | "schedule" | "webhook";

export type DeploymentStatus =
	| "running"
	| "degraded"
	| "errors"
	| "idle"
	| "archived"
	| "deploying";

export type WorkspaceType = "kitaru" | "zenml";

export type WorkspaceStatus = "running" | "degraded" | "idle";

type StatusKey = FlowStatus | ExecStatus;

// Mirrors kitaru-ui's StatusDot mapping. running/retrying use warning (not info)
// to match production. waiting / sleeping / cancelled are prototype-only.
const statusStyles: Record<
	StatusKey,
	{
		badgeVariant: BadgeVariant;
		dot: string;
		ring: string;
	}
> = {
	active: {
		badgeVariant: "success",
		dot: "bg-success",
		ring: "border-success",
	},
	error: {
		badgeVariant: "destructive",
		dot: "bg-destructive",
		ring: "border-destructive",
	},

	initializing: {
		badgeVariant: "teal",
		dot: "bg-accent-teal",
		ring: "border-accent-teal",
	},
	provisioning: {
		badgeVariant: "teal",
		dot: "bg-accent-teal",
		ring: "border-accent-teal",
	},
	running: {
		badgeVariant: "warning",
		dot: "bg-warning",
		ring: "border-warning",
	},
	retrying: {
		badgeVariant: "warning",
		dot: "bg-warning",
		ring: "border-warning",
	},
	failed: {
		badgeVariant: "destructive",
		dot: "bg-destructive",
		ring: "border-destructive",
	},
	completed: {
		badgeVariant: "success",
		dot: "bg-success",
		ring: "border-success",
	},
	cached: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
	},
	skipped: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
	},
	retried: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
	},
	paused: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
	},
	resuming: {
		badgeVariant: "teal",
		dot: "bg-accent-teal",
		ring: "border-accent-teal",
	},
	stopped: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
	},
	stopping: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
	},

	waiting: {
		badgeVariant: "warning",
		dot: "bg-warning",
		ring: "border-warning",
	},
	sleeping: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
	},
	cancelled: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
	},
};

const triggerBadgeVariants: Record<TriggerType, BadgeVariant> = {
	manual: "neutral",
	schedule: "info",
	webhook: "neutral",
};

// D7 deployment status system. Reuses semantic tokens except for "archived"
// which has its own --status-archived (cool neutral, distinct from warm idle).
const deploymentStatusStyles: Record<
	DeploymentStatus,
	{ badgeVariant: BadgeVariant; dot: string; ring: string; text: string }
> = {
	running: {
		badgeVariant: "success",
		dot: "bg-success",
		ring: "border-success",
		text: "text-success",
	},
	degraded: {
		badgeVariant: "warning",
		dot: "bg-warning",
		ring: "border-warning",
		text: "text-warning",
	},
	errors: {
		badgeVariant: "destructive",
		dot: "bg-destructive",
		ring: "border-destructive",
		text: "text-destructive",
	},
	idle: {
		badgeVariant: "neutral",
		dot: "bg-muted-foreground",
		ring: "border-muted-foreground",
		text: "text-muted-foreground",
	},
	archived: {
		badgeVariant: "archived",
		dot: "bg-status-archived",
		ring: "border-status-archived",
		text: "text-status-archived",
	},
	deploying: {
		badgeVariant: "info",
		dot: "bg-info",
		ring: "border-info",
		text: "text-info",
	},
};

export function getDeploymentStatusBadgeVariant(
	status: DeploymentStatus
): BadgeVariant {
	return deploymentStatusStyles[status].badgeVariant;
}

export function getDeploymentStatusDotClass(status: DeploymentStatus) {
	return deploymentStatusStyles[status].dot;
}

export function getDeploymentStatusRingClass(status: DeploymentStatus) {
	return deploymentStatusStyles[status].ring;
}

export function getDeploymentStatusTextClass(status: DeploymentStatus) {
	return deploymentStatusStyles[status].text;
}

export function getStatusBadgeVariant(status: StatusKey): BadgeVariant {
	return statusStyles[status].badgeVariant;
}

export function getStatusDotClass(status: StatusKey) {
	return statusStyles[status].dot;
}

export function getStatusRingClass(status: StatusKey) {
	return statusStyles[status].ring;
}

export function getTriggerBadgeVariant(trigger: TriggerType): BadgeVariant {
	return triggerBadgeVariants[trigger];
}

const workspaceStatusStyles: Record<
	WorkspaceStatus,
	{ dot: string; label: string }
> = {
	running: { dot: "bg-success", label: "Running" },
	degraded: { dot: "bg-warning", label: "Degraded" },
	idle: { dot: "bg-muted-foreground", label: "Idle" },
};

export function getWorkspaceStatusDotClass(status: WorkspaceStatus) {
	return workspaceStatusStyles[status].dot;
}

export function getWorkspaceStatusLabel(status: WorkspaceStatus) {
	return workspaceStatusStyles[status].label;
}

const workspaceTypeStyles: Record<
	WorkspaceType,
	{
		badge: string;
		label: string;
	}
> = {
	zenml: {
		badge: "border-primary/40 text-primary",
		label: "ZenML",
	},
	kitaru: {
		badge: "border-chart-1/40 text-chart-1",
		label: "Kitaru",
	},
};

export function getWorkspaceTypeBadgeClass(type: WorkspaceType) {
	return workspaceTypeStyles[type].badge;
}

export function getWorkspaceTypeLabel(type: WorkspaceType) {
	return workspaceTypeStyles[type].label;
}

// Solid tints for member-avatar fallbacks. Green/brown/orange family only —
// matches the earthy palette in Paper artboards 7E1-0 / 743-0. No gradients
// on text avatars (CLAUDE.md).
const MEMBER_TINTS: string[] = [
	"bg-emerald-700 text-emerald-50 dark:bg-emerald-600 dark:text-emerald-50",
	"bg-stone-700 text-stone-50 dark:bg-stone-600 dark:text-stone-50",
	"bg-amber-700 text-amber-50 dark:bg-amber-600 dark:text-amber-50",
	"bg-green-800 text-green-50 dark:bg-green-700 dark:text-green-50",
	"bg-orange-700 text-orange-50 dark:bg-orange-600 dark:text-orange-50",
	"bg-stone-800 text-stone-50 dark:bg-stone-700 dark:text-stone-50",
];

export function getMemberTintClass(index: number): string {
	return MEMBER_TINTS[
		((index % MEMBER_TINTS.length) + MEMBER_TINTS.length) % MEMBER_TINTS.length
	]!;
}
