const STORAGE_KEY_PREFIX = "kitaru";

export function buildCookieKey(key: string): string {
	return `${STORAGE_KEY_PREFIX}.cookie.${key}`;
}

export function buildLocalStorageKey(key: string): string {
	return `${STORAGE_KEY_PREFIX}.local-storage.${key}`;
}
