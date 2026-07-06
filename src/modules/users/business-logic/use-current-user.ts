import { useSuspenseQuery } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { userQueries } from "./user-queries";

type SuspenseOptions = Omit<
	ReturnType<typeof userQueries.currentUser>,
	"queryKey" | "queryFn"
>;

export function useCurrentUser(opts: SuspenseOptions = {}) {
	const kitaruApiRuntime = useKitaruApiRuntime();
	const query = useSuspenseQuery({
		...userQueries.currentUser(kitaruApiRuntime),
		...opts,
	});

	return { ...query, currentUserData: query.data };
}
