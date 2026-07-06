import { useQuery } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { apiKeyQueries } from "./api-key-queries";

type Options = Omit<
	ReturnType<typeof apiKeyQueries.list>,
	"queryKey" | "queryFn"
>;

export function useApiKeys(serviceAccountId: string, opts: Options = {}) {
	const kitaruApiRuntime = useKitaruApiRuntime();
	const query = useQuery({
		...apiKeyQueries.list({ serviceAccountId }, kitaruApiRuntime, opts),
	});

	return { ...query, apiKeysData: query.data };
}
