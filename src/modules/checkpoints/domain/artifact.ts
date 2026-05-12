import type { components } from "@/shared/api/openapi";
import { isRecord } from "@/shared/utils/is-record";

export type ArtifactEntry = {
	name: string;
	id: string;
};

type ArtifactDirection = "input" | "output";

const visibleInputTypes = new Set<
	components["schemas"]["StepRunInputArtifactType"]
>(["manual", "step_output"]);
const visibleOutputSaveTypes = new Set<
	components["schemas"]["ArtifactSaveType"]
>(["manual", "step_output"]);

export function extractInputArtifactEntries(
	record: Record<string, unknown> | undefined
): ArtifactEntry[] {
	return extractArtifactEntries(record, "input");
}

export function extractOutputArtifactEntries(
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

		const visible = value.flatMap((entry) => {
			const parsed = parseVisibleArtifact(entry, direction);
			return parsed ? [parsed] : [];
		});

		return visible.map((id, index) => ({
			name: visible.length === 1 ? name : `${name}[${index}]`,
			id,
		}));
	});
}

function parseVisibleArtifact(
	value: unknown,
	direction: ArtifactDirection
): string | undefined {
	if (!isRecord(value)) return undefined;

	const id = getNonEmptyString(value.id);
	const body = isRecord(value.body) ? value.body : undefined;
	const artifact = body && isRecord(body.artifact) ? body.artifact : undefined;
	const artifactName = artifact ? getNonEmptyString(artifact.name) : undefined;

	if (!id || !artifactName) return undefined;

	if (direction === "input") {
		const inputType = parseInputArtifactType(value.input_type);
		if (inputType !== undefined && !visibleInputTypes.has(inputType))
			return undefined;
		if (inputType === undefined && artifactName.startsWith("external_"))
			return undefined;
	} else {
		const saveType = parseArtifactSaveType(body?.save_type);
		if (saveType !== undefined && !visibleOutputSaveTypes.has(saveType))
			return undefined;
		if (saveType === undefined && artifactName.startsWith("external_"))
			return undefined;
	}

	return id;
}

function parseArtifactSaveType(
	value: unknown
): components["schemas"]["ArtifactSaveType"] | undefined {
	return value === "external" ||
		value === "manual" ||
		value === "preexisting" ||
		value === "step_output"
		? value
		: undefined;
}

function parseInputArtifactType(
	value: unknown
): components["schemas"]["StepRunInputArtifactType"] | undefined {
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
