import type { components } from "@/shared/api/openapi";
import { parseBackendTimestamp } from "@/shared/utils/time";

export const MEMORY_TAG_MARKER = "kitaru:memory";
export const MEMORY_TAG_SCOPE_PREFIX = "kitaru:memory:scope:";
export const MEMORY_TAG_KEY_PREFIX = "kitaru:memory:key:";
export const MEMORY_TAG_SCOPE_TYPE_PREFIX = "kitaru:memory:scope_type:";
export const MEMORY_TAG_FLOW_ID_PREFIX = "kitaru:memory:flow_id:";
export const COMPACTION_LOG_PREFIX = "_compaction/";
export const MEMORY_SCOPE_TYPE_METADATA_KEY = "kitaru_memory_scope_type";
export const MEMORY_DELETED_METADATA_KEY = "kitaru_memory_deleted";

const ARTIFACT_NAME_PREFIX = "kitaru_mem:";

export const memoryScopeTypeValues = [
	"flow",
	"namespace",
	"execution",
	"unknown",
] as const;

export type MemoryScopeType = (typeof memoryScopeTypeValues)[number];

export const SCOPE_TYPE_SORT_ORDER: Record<MemoryScopeType, number> = {
	flow: 0,
	namespace: 1,
	execution: 2,
	unknown: 3,
};

export type MemoryEntry = {
	key: string;
	valueType: string;
	version: string;
	scope: string;
	scopeType: MemoryScopeType;
	createdAt: Date;
	isDeleted: boolean;
	artifactId: string;
};

export type MemoryScopeInfo = {
	scope: string;
	scopeType: MemoryScopeType;
	entryCount: number;
};

export function buildMemoryArtifactName(scope: string, key: string): string {
	return `${ARTIFACT_NAME_PREFIX}${scope}:${key}`;
}

export function parseMemoryArtifactName(
	name: string
): { scope: string; key: string } | undefined {
	if (!name.startsWith(ARTIFACT_NAME_PREFIX)) return undefined;

	const rest = name.slice(ARTIFACT_NAME_PREFIX.length);
	const colonIndex = rest.indexOf(":");
	if (colonIndex <= 0) return undefined;

	const scope = rest.slice(0, colonIndex);
	const key = rest.slice(colonIndex + 1);
	if (!key) return undefined;

	return { scope, key };
}

export function isCompactionKey(key: string): boolean {
	return key.startsWith(COMPACTION_LOG_PREFIX);
}

function parseScopeType(value: unknown): MemoryScopeType {
	const found = memoryScopeTypeValues.find((v) => v === value);
	return found ?? "unknown";
}

function parseIsDeleted(value: unknown): boolean {
	return value === true || value === "true";
}

function inferValueType(dataType: components["schemas"]["Source"]): string {
	const attr = dataType.attribute;
	if (attr) return attr;
	const mod = dataType.module;
	const lastDot = mod.lastIndexOf(".");
	return lastDot >= 0 ? mod.slice(lastDot + 1) : mod;
}

export function mapArtifactVersionToMemoryEntry(
	artifact: components["schemas"]["ArtifactVersionResponse"]
): MemoryEntry | null {
	const body = artifact.body;
	if (!body) return null;

	const parsed = parseMemoryArtifactName(body.artifact.name);
	if (!parsed) return null;
	const runMetadata = artifact.metadata?.run_metadata ?? {};

	return {
		key: parsed.key,
		scope: parsed.scope,
		version: body.version,
		valueType: inferValueType(body.data_type),
		scopeType: parseScopeType(runMetadata[MEMORY_SCOPE_TYPE_METADATA_KEY]),
		createdAt: parseBackendTimestamp(body.created),
		isDeleted: parseIsDeleted(runMetadata[MEMORY_DELETED_METADATA_KEY]),
		artifactId: artifact.id,
	};
}
