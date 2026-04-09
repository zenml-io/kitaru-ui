import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { parseMemoryArtifactName } from "@/modules/memory/domain/memory";
import { isRecord } from "@/shared/utils/is-record";
import { parseBackendTimestamp } from "@/shared/utils/time";

export type ArtifactEntry = {
	name: string;
	id: string;
};

export type Checkpoint = {
	id: string;
	name: string;
	durationMs?: number;
	status?: ExecutionStatus;
	startTime?: Date;
	endTime?: Date;
	type?: components["schemas"]["StepType"];
	costUsd?: number;
	inputs: ArtifactEntry[];
	outputs: ArtifactEntry[];
};

type ArtifactDirection = "input" | "output";
type ArtifactSaveType = components["schemas"]["ArtifactSaveType"];
type StepRunInputArtifactType =
	components["schemas"]["StepRunInputArtifactType"];

type ArtifactCandidate = {
	id: string;
	artifactName: string;
	saveType?: ArtifactSaveType;
	inputType?: StepRunInputArtifactType;
};

const visibleInputTypes = new Set<StepRunInputArtifactType>([
	"manual",
	"step_output",
]);
const visibleOutputSaveTypes = new Set<ArtifactSaveType>([
	"manual",
	"step_output",
]);

export function checkpointFromApiToDomain(
	checkpoint: components["schemas"]["StepRunResponse"]
): Checkpoint {
	return {
		id: checkpoint.id,
		name: checkpoint.name,
		status: checkpoint.body?.status || undefined,
		inputs: extractInputArtifactEntries(checkpoint.resources?.inputs),
		outputs: extractOutputArtifactEntries(checkpoint.resources?.outputs),
		startTime: checkpoint.body?.start_time
			? parseBackendTimestamp(checkpoint.body.start_time)
			: undefined,
		endTime: checkpoint.body?.end_time
			? parseBackendTimestamp(checkpoint.body.end_time)
			: undefined,
		durationMs:
			checkpoint.body?.end_time && checkpoint.body?.start_time
				? parseBackendTimestamp(checkpoint.body.end_time).getTime() -
					parseBackendTimestamp(checkpoint.body.start_time).getTime()
				: undefined,
		type: checkpoint.body?.type ?? undefined,
		costUsd:
			// @ts-expect-error - TODO: fix this
			checkpoint.metadata?.run_metadata?.llm_usage?.cost_usd ?? undefined,
	};
}

function extractInputArtifactEntries(
	record: Record<string, unknown> | undefined
): ArtifactEntry[] {
	return extractArtifactEntries(record, "input");
}

function extractOutputArtifactEntries(
	record: Record<string, unknown> | undefined
): ArtifactEntry[] {
	return extractArtifactEntries(record, "output");
}

function extractArtifactEntries(
	record: Record<string, unknown> | undefined,
	direction: ArtifactDirection
): ArtifactEntry[] {
	if (!record) return [];
	return Object.entries(record).flatMap(([name, value]) => {
		if (!Array.isArray(value)) return [];

		const visibleCandidates = value.flatMap((entry) => {
			const candidate = toArtifactCandidate(entry, direction);
			if (!candidate || !shouldIncludeArtifact(candidate, direction)) {
				return [];
			}
			return [candidate];
		});

		return visibleCandidates.map((candidate, visibleIndex) => ({
			name: visibleCandidates.length === 1 ? name : `${name}[${visibleIndex}]`,
			id: candidate.id,
		}));
	});
}

function toArtifactCandidate(
	value: unknown,
	direction: ArtifactDirection
): ArtifactCandidate | undefined {
	if (!isRecord(value)) return undefined;

	const id = getNonEmptyString(value.id);
	const body = isRecord(value.body) ? value.body : undefined;
	const artifact = body && isRecord(body.artifact) ? body.artifact : undefined;
	const artifactName = artifact ? getNonEmptyString(artifact.name) : undefined;

	if (!id || !artifactName) return undefined;

	return {
		id,
		artifactName,
		saveType: parseArtifactSaveType(body?.save_type),
		inputType:
			direction === "input"
				? parseInputArtifactType(value.input_type)
				: undefined,
	};
}

function shouldIncludeArtifact(
	candidate: ArtifactCandidate,
	direction: ArtifactDirection
): boolean {
	if (parseMemoryArtifactName(candidate.artifactName) !== undefined) {
		return false;
	}

	if (direction === "input") {
		if (candidate.inputType !== undefined) {
			return visibleInputTypes.has(candidate.inputType);
		}
		return !candidate.artifactName.startsWith("external_");
	}

	if (candidate.saveType !== undefined) {
		return visibleOutputSaveTypes.has(candidate.saveType);
	}

	return !candidate.artifactName.startsWith("external_");
}

function parseArtifactSaveType(value: unknown): ArtifactSaveType | undefined {
	return value === "external" ||
		value === "manual" ||
		value === "preexisting" ||
		value === "step_output"
		? value
		: undefined;
}

function parseInputArtifactType(
	value: unknown
): StepRunInputArtifactType | undefined {
	return value === "external" ||
		value === "lazy" ||
		value === "manual" ||
		value === "step_output"
		? value
		: undefined;
}

function getNonEmptyString(value: unknown): string | undefined {
	return typeof value === "string" && value.length > 0 ? value : undefined;
}

export type CheckpointEntry = {
	id: string;
	name: string;
	durationMs?: number;
	status: ExecutionStatus;
	startTime?: Date;
	type?: components["schemas"]["StepType"];
};

export function checkpointEntryFromApiToDomain(
	node: components["schemas"]["Node"]
): CheckpointEntry {
	return {
		id: node.id ?? node.node_id,
		name: node.name,
		durationMs: node.metadata?.duration
			? (Number(node.metadata?.duration) || 0) * 1000
			: undefined,
		status: node.metadata?.status as ExecutionStatus,
		startTime: node.metadata?.start_time
			? parseBackendTimestamp(node.metadata?.start_time as string)
			: undefined,
		type: node.metadata?.type as components["schemas"]["StepType"],
	};
}

export type DagResponse = {
	executionStatus: ExecutionStatus;
	hasPendingWaitConditionNode: boolean;
	checkpoints: CheckpointEntry[];
};
