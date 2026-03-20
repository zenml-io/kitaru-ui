export function sanitizeUuidFromPath(path: string): string {
	const uuidv4Pattern =
		/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/gi;
	const cleanedPath = path.replace(uuidv4Pattern, "<id>");
	return cleanedPath;
}
