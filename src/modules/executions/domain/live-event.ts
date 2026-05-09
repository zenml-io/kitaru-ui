import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { isRecord } from "@/shared/utils/is-record";

export type ExecutionLiveEventCategory =
	| "checkpoint_lifecycle"
	| "checkpoint_progress"
	| "openai_text_delta"
	| "openai_stream_lifecycle"
	| "custom"
	| "unknown";

export type ExecutionLiveEvent = {
	transportId?: string;
	executionId: string;
	kind: string;
	timestamp?: Date;
	streamId?: string;
	index?: number;
	checkpointId?: string;
	checkpointName?: string;
	message?: string;
	progressRatio?: number;
	textDelta?: string;
	display?: string;
	payload: Record<string, unknown>;
	category: ExecutionLiveEventCategory;
};

export type LiveEventGapAction = {
	type: "gap";
	reason?: string;
};

export type LiveEventErrorAction = {
	type: "error";
	reason?: string;
};

export type LiveEventEndAction = {
	type: "end";
	reason?: string;
};

export type LiveEventMappedAction =
	| { type: "event"; event: ExecutionLiveEvent }
	| LiveEventGapAction
	| LiveEventErrorAction
	| LiveEventEndAction
	| { type: "ignored" };

export type CheckpointIdentityLookup = {
	byStepRunId: Map<string, CheckpointEntry>;
	byFallbackNodeId: Map<string, CheckpointEntry>;
	byName: Map<string, CheckpointEntry>;
};

export type CheckpointSelectionResolution = {
	checkpointId?: string;
	reason?: string;
};

type SseLikeFrame = {
	id?: string;
	event?: string;
	data: string;
};

const checkpointKindPrefix = "kitaru.checkpoint.";
const openAiStreamKindPrefix = "openai_agents.stream.";

const checkpointLifecycleKinds = new Set([
	`${checkpointKindPrefix}started`,
	`${checkpointKindPrefix}completed`,
	`${checkpointKindPrefix}failed`,
]);

export function classifyLiveEventKind(
	kind: string,
	payload: Record<string, unknown>
): ExecutionLiveEventCategory {
	if (checkpointLifecycleKinds.has(kind)) {
		return "checkpoint_lifecycle";
	}
	if (kind === `${checkpointKindPrefix}progress`) {
		return "checkpoint_progress";
	}
	if (kind === `${openAiStreamKindPrefix}event`) {
		return getString(payload, "text_delta")
			? "openai_text_delta"
			: "openai_stream_lifecycle";
	}
	if (
		kind === `${openAiStreamKindPrefix}start` ||
		kind === `${openAiStreamKindPrefix}end` ||
		kind === `${openAiStreamKindPrefix}error`
	) {
		return "openai_stream_lifecycle";
	}
	return kind ? "custom" : "unknown";
}

export function mapSseFrameToLiveEventAction(
	frame: SseLikeFrame,
	executionId: string
): LiveEventMappedAction {
	const eventName = frame.event ?? "message";

	if (eventName === "gap") {
		return { type: "gap", reason: getSpecialFrameReason(frame.data) };
	}
	if (eventName === "error") {
		return { type: "error", reason: getSpecialFrameReason(frame.data) };
	}
	if (eventName === "end") {
		return { type: "end", reason: getSpecialFrameReason(frame.data) };
	}
	if (!frame.data.trim()) {
		return { type: "ignored" };
	}

	const data = parseJsonRecord(frame.data);
	if (!data) {
		return { type: "ignored" };
	}

	const payload = getRecord(data, "payload") ?? {};
	const kind = getString(data, "kind") ?? eventName;
	const kitaruPayload = getRecord(payload, "kitaru");
	const rawPercent =
		getNumber(getRecord(payload, "data") ?? {}, "percent") ??
		getNumber(payload, "percent");

	const event: ExecutionLiveEvent = {
		transportId: frame.id,
		executionId: getString(data, "pipeline_run_id") ?? executionId,
		kind,
		timestamp: parseOptionalDate(getString(data, "ts")),
		streamId: getString(data, "stream_id"),
		index: getNumber(data, "index"),
		checkpointId:
			getString(kitaruPayload ?? {}, "checkpoint_id") ??
			getString(data, "step_run_id"),
		checkpointName:
			getString(kitaruPayload ?? {}, "checkpoint_name") ??
			getString(data, "step_name"),
		message: getString(payload, "message"),
		progressRatio: normalizeProgressRatio(rawPercent),
		textDelta: getString(payload, "text_delta"),
		display: getString(payload, "display"),
		payload,
		category: classifyLiveEventKind(kind, payload),
	};

	return { type: "event", event };
}

export function getLiveEventDedupeKey(
	event: ExecutionLiveEvent
): string | undefined {
	if (event.transportId) {
		return `transport:${event.transportId}`;
	}
	if (event.streamId && event.index !== undefined) {
		return `stream:${event.kind}:${event.streamId}:${event.index}`;
	}
	return undefined;
}

export function buildCheckpointIdentityLookup(
	checkpoints: CheckpointEntry[]
): CheckpointIdentityLookup {
	const byStepRunId = new Map<string, CheckpointEntry>();
	const byFallbackNodeId = new Map<string, CheckpointEntry>();
	const byName = new Map<string, CheckpointEntry>();

	for (const checkpoint of checkpoints) {
		if (checkpoint.id.startsWith("step/")) {
			byFallbackNodeId.set(checkpoint.id, checkpoint);
		} else {
			byStepRunId.set(checkpoint.id, checkpoint);
		}
		byName.set(checkpoint.name, checkpoint);
	}

	return { byStepRunId, byFallbackNodeId, byName };
}

export function shouldRefetchCheckpointDagForLiveEvent(
	event: ExecutionLiveEvent,
	lookup: CheckpointIdentityLookup
): boolean {
	if (!event.checkpointId) {
		return false;
	}
	if (lookup.byStepRunId.has(event.checkpointId)) {
		return false;
	}
	if (lookup.byFallbackNodeId.has(event.checkpointId)) {
		return true;
	}
	if (!event.checkpointName) {
		return false;
	}
	const byName = lookup.byName.get(event.checkpointName);
	return byName !== undefined && byName.id.startsWith("step/");
}

export function resolveLiveEventCheckpointSelection(
	event: ExecutionLiveEvent,
	lookup: CheckpointIdentityLookup
): CheckpointSelectionResolution {
	if (event.checkpointId) {
		const exact = lookup.byStepRunId.get(event.checkpointId);
		if (exact) {
			return { checkpointId: exact.id };
		}
		if (lookup.byFallbackNodeId.has(event.checkpointId)) {
			return {
				reason: "Checkpoint details are not available yet for this live event.",
			};
		}
	}

	if (event.checkpointName) {
		const byName = lookup.byName.get(event.checkpointName);
		if (byName && !byName.id.startsWith("step/")) {
			return { checkpointId: byName.id };
		}
		if (byName) {
			return {
				reason: "Checkpoint details are not available yet for this live event.",
			};
		}
	}

	if (event.checkpointId) {
		return {
			reason:
				"This live event has a checkpoint id that is not in the current checkpoint list yet.",
		};
	}

	if (event.checkpointName) {
		return {
			reason:
				"This live event has a checkpoint name that is not in the current checkpoint list yet.",
		};
	}

	return {};
}

function getSpecialFrameReason(data: string): string | undefined {
	const parsed = parseJsonRecord(data);
	return parsed ? getString(parsed, "reason") : undefined;
}

function parseJsonRecord(value: string): Record<string, unknown> | undefined {
	try {
		const parsed: unknown = JSON.parse(value);
		return isRecord(parsed) ? parsed : undefined;
	} catch {
		return undefined;
	}
}

function getRecord(
	value: Record<string, unknown>,
	key: string
): Record<string, unknown> | undefined {
	const candidate = value[key];
	return isRecord(candidate) ? candidate : undefined;
}

function getString(
	value: Record<string, unknown>,
	key: string
): string | undefined {
	const candidate = value[key];
	return typeof candidate === "string" ? candidate : undefined;
}

function getNumber(
	value: Record<string, unknown>,
	key: string
): number | undefined {
	const candidate = value[key];
	return typeof candidate === "number" && Number.isFinite(candidate)
		? candidate
		: undefined;
}

function parseOptionalDate(value: string | undefined): Date | undefined {
	if (!value) {
		return undefined;
	}
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

function normalizeProgressRatio(value: number | undefined): number | undefined {
	if (value === undefined) {
		return undefined;
	}
	const ratio = value > 1 ? value / 100 : value;
	return Math.min(1, Math.max(0, ratio));
}
