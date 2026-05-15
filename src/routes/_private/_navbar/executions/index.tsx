import {
	type SearchSchemaInput,
	createFileRoute,
	stripSearchParams,
} from "@tanstack/react-router";
import { z } from "zod";
import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { executionStatusFilterValues } from "@/modules/executions/domain/execution";
import { GlobalExecutionsContainer } from "@/modules/executions/feature/GlobalExecutionsContainer";
import {
	GLOBAL_EXECUTIONS_ALLOWED_SORT_FIELDS,
	GLOBAL_EXECUTIONS_RANGE_VALUES,
	GLOBAL_EXECUTIONS_SEARCH_DEFAULTS,
} from "@/modules/executions/domain/global-executions-query-params";
import { PageSpinner } from "@/shared/ui/spinner";
import { sortBySchema } from "@/shared/utils/sorting";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

const executionsSearchSchema = z.object({
	status: z
		.enum(executionStatusFilterValues)
		.catch(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.status),
	flow: z.string().optional(),
	version: z.string().optional(),
	stack: z.string().optional(),
	range: z
		.enum(GLOBAL_EXECUTIONS_RANGE_VALUES)
		.catch(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.range),
	q: z.string().catch(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.q),
	page: z.coerce.number().min(1).catch(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.page),
	sort: sortBySchema([...GLOBAL_EXECUTIONS_ALLOWED_SORT_FIELDS]).catch(
		GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.sort
	),
});

type ExecutionsSearchSchemaInput = SearchSchemaInput & {
	status?: string;
	flow?: string;
	version?: string;
	stack?: string;
	range?: string;
	q?: string;
	page?: number;
	sort?: string;
};

export const Route = createFileRoute("/_private/_navbar/executions/")({
	validateSearch: (search: ExecutionsSearchSchemaInput) =>
		executionsSearchSchema.parse(search),
	search: {
		middlewares: [stripSearchParams(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS)],
	},
	component: GlobalExecutionsContainer,
	head: () => ({
		meta: [{ title: buildPageTitles("Executions") }],
	}),
	pendingComponent: PageSpinner,
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(executionsQueries.global(deps));
	},
});
