import {
	Link,
	type SearchSchemaInput,
	createFileRoute,
	stripSearchParams,
	useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";
import { executionsQueries } from "@zenml/shared-kitaru/modules/executions";
import { executionStatusFilterValues } from "@zenml/shared-kitaru/modules/executions";
import { GlobalExecutionsContainer } from "@zenml/shared-kitaru/modules/executions";
import {
	GLOBAL_EXECUTIONS_ALLOWED_SORT_FIELDS,
	EXECUTIONS_RANGE_VALUES,
	GLOBAL_EXECUTIONS_SEARCH_DEFAULTS,
} from "@zenml/shared-kitaru/modules/executions";
import { PageSpinner } from "@zenml/shared-kitaru/ui/spinner";
import { sortBySchema } from "@zenml/shared-kitaru/utils/sorting";
import { optionalFilterString } from "@zenml/shared-kitaru/utils/search-filter";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import {
	GlobalExecutionsRouteProvider,
	type ExecutionLinkProps,
	type GlobalExecutionsRouteState,
} from "@zenml/shared-kitaru/modules/executions";
// FlowLinkProps is owned by the flows module (executions reuses it, does not redefine it)
import type { FlowLinkProps } from "@zenml/shared-kitaru/modules/flows";

const executionsSearchSchema = z.object({
	status: z
		.enum(executionStatusFilterValues)
		.catch(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.status),
	flow: optionalFilterString(),
	version: optionalFilterString(),
	stack: optionalFilterString(),
	range: z
		.enum(EXECUTIONS_RANGE_VALUES)
		.catch(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.range),
	q: z.string().catch(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.q),
	page: z.coerce.number().int().min(1).catch(GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.page),
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
	component: GlobalExecutionsRouteAdapter,
	head: () => ({
		meta: [{ title: buildPageTitles("Executions") }],
	}),
	pendingComponent: PageSpinner,
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(
			executionsQueries.global(
				{
					search: deps,
				},
				context
			)
		);
	},
});

function LinkToExecution({
	flowId,
	version,
	executionId,
	className,
	children,
}: ExecutionLinkProps) {
	return (
		<Link
			to="/flows/$flowId/v/$version/executions/$executionId"
			params={{ flowId, version, executionId }}
			className={className}
		>
			{children}
		</Link>
	);
}

function LinkToFlow({ flowId, className, children }: FlowLinkProps) {
	return (
		<Link to="/flows/$flowId" params={{ flowId }} className={className}>
			{children}
		</Link>
	);
}

function GlobalExecutionsRouteAdapter() {
	const search = Route.useSearch();
	const navigate = useNavigate();

	function updateSearch(next: Partial<GlobalExecutionsRouteState>) {
		void navigate({
			to: "/executions",
			search: (prev) => ({ ...prev, ...next }),
			replace: true,
		});
	}

	function clearFilters() {
		void navigate({
			to: "/executions",
			search: (prev) => ({ sort: prev.sort }),
			replace: true,
		});
	}

	return (
		<GlobalExecutionsRouteProvider
			state={search}
			navigation={{ updateSearch, clearFilters, LinkToExecution, LinkToFlow }}
		>
			<GlobalExecutionsContainer />
		</GlobalExecutionsRouteProvider>
	);
}
