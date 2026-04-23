import { useState } from "react";

import type { SecretKey } from "../domain/secrets";

export function useSecretKeySearch(keys: SecretKey[]) {
	const [search, setSearch] = useState("");
	const query = search.trim().toLowerCase();
	const filteredKeys =
		query === ""
			? keys
			: keys.filter((k) => k.key.toLowerCase().includes(query));
	return { search, setSearch, filteredKeys };
}
