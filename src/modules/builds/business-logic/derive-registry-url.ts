export function deriveRegistryUrl(image: string): string | null {
	const slashIndex = image.indexOf("/");
	if (slashIndex === -1) return null;
	const registryHost = image.slice(0, slashIndex);
	if (!registryHost.includes(".") && !registryHost.includes(":")) return null;
	const withoutDigest = image.split("@")[0];
	const lastSlash = withoutDigest.lastIndexOf("/");
	const lastColon = withoutDigest.lastIndexOf(":");
	const reference =
		lastColon > lastSlash ? withoutDigest.slice(0, lastColon) : withoutDigest;
	return `https://${reference}`;
}
