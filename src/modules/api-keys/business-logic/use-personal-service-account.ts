import { useSuspenseQuery } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { personalServiceAccountQueries } from "./personal-service-account-queries";

type SuspenseOptions = Omit<
	ReturnType<typeof personalServiceAccountQueries.resolve>,
	"queryKey" | "queryFn"
>;

export function usePersonalServiceAccount(
	userId: string,
	opts: SuspenseOptions = {}
) {
	const kitaruApiRuntime = useKitaruApiRuntime();
	const query = useSuspenseQuery({
		...personalServiceAccountQueries.resolve({ userId }, kitaruApiRuntime),
		...opts,
	});

	return { ...query, personalServiceAccountData: query.data };
}
