import { isArray, isObject } from "es-toolkit/compat";

export function isRecord(value: unknown): value is Record<string, unknown> {
	return isObject(value) && !isArray(value);
}
