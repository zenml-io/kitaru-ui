import {
	type SearchSchemaInput,
	createFileRoute,
	stripSearchParams,
} from "@tanstack/react-router";
import { z } from "zod";
import { executionStatusFilterValues } from "@/modules/executions/domain/execution";
import { GlobalExecutionsContainer } from "@/modules/executions/feature/GlobalExecutionsContainer";
import {
	DEFAULT_GLOBAL_EXECUTIONS_SORT,
	GLOBAL_EXECUTIONS_ALLOWED_SORT_FIELDS,
	GLOBAL_EXECUTIONS_RANGE_VALUES,
} from "@/modules/executions/domain/global-executions-query-params";
import { sortBySchema } from "@/shared/utils/sorting";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

const executionsSearchSchema = z.object({
	status: z.enum(executionStatusFilterValues).catch("all"),
	flow: z.string().optional(),
	version: z.string().optional(),
	stack: z.string().optional(),
	range: z.enum(GLOBAL_EXECUTIONS_RANGE_VALUES).catch("all"),
	q: z.string().catch(""),
	page: z.coerce.number().min(1).catch(1),
	sort: sortBySchema([...GLOBAL_EXECUTIONS_ALLOWED_SORT_FIELDS]).catch(
		DEFAULT_GLOBAL_EXECUTIONS_SORT
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
		middlewares: [
			stripSearchParams({
				status: "all",
				range: "all",
				q: "",
				page: 1,
				sort: DEFAULT_GLOBAL_EXECUTIONS_SORT,
			}),
		],
	},
	component: GlobalExecutionsContainer,
	head: () => ({
		meta: [{ title: buildPageTitles("Executions") }],
	}),
});
