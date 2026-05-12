import { FlowsContainer } from "@/modules/flows/feature/FlowsContainer";
import {
	flowStatusFilterValues,
	type FlowStatusFilter,
} from "@/modules/flows/domain/flow";
import {
	ALLOWED_FLOWS_SORT_FIELDS,
	DEFAULT_FLOWS_SORT,
} from "@/modules/flows/business-logic/flows-queries";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { sortBySchema } from "@/shared/utils/sorting";
import {
	type SearchSchemaInput,
	createFileRoute,
	stripSearchParams,
} from "@tanstack/react-router";
import { z } from "zod";

import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { PageSpinner } from "@/shared/ui/spinner";

const flowsSearchSchema = z.object({
	q: z.string().catch(""),
	status: z.enum(flowStatusFilterValues).catch("all"),
	sort: sortBySchema([...ALLOWED_FLOWS_SORT_FIELDS]).catch(DEFAULT_FLOWS_SORT),
});

type FlowsSearchSchemaInput = SearchSchemaInput & {
	q?: string;
	status?: FlowStatusFilter;
	sort?: string;
};

export const Route = createFileRoute("/_private/_navbar/flows/")({
	validateSearch: (search: FlowsSearchSchemaInput) =>
		flowsSearchSchema.parse(search),
	search: {
		middlewares: [
			stripSearchParams({ q: "", status: "all", sort: DEFAULT_FLOWS_SORT }),
		],
	},
	component: FlowsContainer,
	head: () => ({
		meta: [{ title: buildPageTitles("Flows") }],
	}),
	pendingComponent: PageSpinner,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(flowsQueries.list(deps));
	},
	loaderDeps: ({ search }) => ({
		name: search.q,
		status: search.status,
		sort: search.sort,
	}),
});
