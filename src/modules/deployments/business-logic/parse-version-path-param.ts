import { z } from "zod";
import { LOCAL_VERSION_ID, type DeploymentVersion } from "../domain/deployment";

const versionSchema = z.union([
	z.literal(LOCAL_VERSION_ID),
	z
		.string()
		.regex(/^[1-9]\d*$/)
		.transform(Number),
]);

export function parseVersionPathParam(
	raw: string
): DeploymentVersion | undefined {
	const result = versionSchema.safeParse(raw);
	return result.success ? result.data : undefined;
}
