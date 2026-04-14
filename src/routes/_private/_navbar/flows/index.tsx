import { FlowsContainer } from "@/modules/flows/feature/FlowsContainer";
import {
	flowStatusFilterValues,
	type FlowStatusFilter,
} from "@/modules/flows/domain/flow";
import { DEFAULT_FLOWS_SORT } from "@/modules/flows/domain/fetch-flows";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
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
	sort: z.string().catch(DEFAULT_FLOWS_SORT),
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
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(flowsQueries.all());
	},
});
