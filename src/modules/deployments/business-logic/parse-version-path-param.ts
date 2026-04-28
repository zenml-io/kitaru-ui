import { z } from "zod";
import { LOCAL_VERSION_ID } from "../domain/local-deployment";

const versionSchema = z.union([
	z.literal(LOCAL_VERSION_ID),
	z
		.string()
		.regex(/^[1-9]\d*$/)
		.transform(Number),
]);

export function parseVersionPathParam(
	raw: string
): number | typeof LOCAL_VERSION_ID | undefined {
	const result = versionSchema.safeParse(raw);
	return result.success ? result.data : undefined;
}
