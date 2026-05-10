import { useSuspenseQuery } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import { executionsQueries } from "../business-logic/executions-queries";
import type { GlobalExecutionsQueryParams } from "../domain/global-executions-query-params";
import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import {
	GlobalExecutionsTable,
	type SnapshotVersionLookup,
} from "../ui/GlobalExecutionsTable";

type GlobalExecutionsTableContainerProps = {
	params: GlobalExecutionsQueryParams;
	sorting: SortingState;
	onSortingChange: (state: SortingState) => void;
};

export function GlobalExecutionsTableContainer({
	params,
	sorting,
	onSortingChange,
}: GlobalExecutionsTableContainerProps) {
	const { data: page } = useSuspenseQuery(executionsQueries.global(params));
	const { data: deployments } = useSuspenseQuery(deploymentsQueries.allFlows());

	const versionLookup: SnapshotVersionLookup = new Map(
		deployments.map((d) => [d.id, d])
	);

	return (
		<GlobalExecutionsTable
			executions={page.items}
			versionLookup={versionLookup}
			sorting={sorting}
			onSortingChange={onSortingChange}
		/>
	);
}
