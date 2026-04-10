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

export type MemoryScopeIdentity = {
	scope: string;
	scopeType: MemoryScopeType;
};

export type MemoryScopeInfo = MemoryScopeIdentity & {
	entryCount: number;
};

export function memoryScopeIdentityKey({
	scope,
	scopeType,
}: MemoryScopeIdentity): string {
	return `${scopeType}:${scope}`;
}

export function isSameMemoryScopeIdentity(
	left: MemoryScopeIdentity,
	right: MemoryScopeIdentity
): boolean {
	return left.scope === right.scope && left.scopeType === right.scopeType;
}

export function buildMemoryArtifactName(
	scope: MemoryScopeIdentity,
	key: string
): string {
	return `${ARTIFACT_NAME_PREFIX}${scope.scopeType}:${scope.scope}:${key}`;
}

export function buildMemoryArtifactPrefix(scope: MemoryScopeIdentity): string {
	return `${ARTIFACT_NAME_PREFIX}${scope.scopeType}:${scope.scope}:`;
}

export function parseMemoryArtifactName(
	name: string
): (MemoryScopeIdentity & { key: string }) | undefined {
	if (!name.startsWith(ARTIFACT_NAME_PREFIX)) return undefined;

	const rest = name.slice(ARTIFACT_NAME_PREFIX.length);
	const firstColonIndex = rest.indexOf(":");
	if (firstColonIndex <= 0) return undefined;

	const maybeScopeType = rest.slice(0, firstColonIndex);
	const remainder = rest.slice(firstColonIndex + 1);

	if (memoryScopeTypeValues.includes(maybeScopeType as MemoryScopeType)) {
		const secondColonIndex = remainder.indexOf(":");
		if (secondColonIndex <= 0) return undefined;

		const scope = remainder.slice(0, secondColonIndex);
		const key = remainder.slice(secondColonIndex + 1);
		if (!scope || !key) return undefined;
		return {
			scope,
			scopeType: maybeScopeType as MemoryScopeType,
			key,
		};
	}

	if (!remainder) return undefined;

	return {
		scope: maybeScopeType,
		scopeType: "unknown",
		key: remainder,
	};
}

export function isCompactionKey(key: string): boolean {
	return key.startsWith(COMPACTION_LOG_PREFIX);
}

function parseScopeType(value: unknown): MemoryScopeType {
	if (
		typeof value === "string" &&
		memoryScopeTypeValues.includes(value as MemoryScopeType)
	) {
		return value as MemoryScopeType;
	}
	return "unknown";
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
		scopeType:
			parsed.scopeType === "unknown"
				? parseScopeType(runMetadata[MEMORY_SCOPE_TYPE_METADATA_KEY])
				: parsed.scopeType,
		createdAt: parseBackendTimestamp(body.created),
		isDeleted: parseIsDeleted(runMetadata[MEMORY_DELETED_METADATA_KEY]),
		artifactId: artifact.id,
	};
}
