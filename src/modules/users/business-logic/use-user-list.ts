import { useSuspenseQuery } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { userQueries } from "./user-queries";

type SuspenseOptions = Omit<
	ReturnType<typeof userQueries.list>,
	"queryKey" | "queryFn"
>;

export function useUserList(opts: SuspenseOptions = {}) {
	const kitaruApiRuntime = useKitaruApiRuntime();
	const query = useSuspenseQuery({
		...userQueries.list(kitaruApiRuntime),
		...opts,
	});

	return { ...query, userListData: query.data };
}
