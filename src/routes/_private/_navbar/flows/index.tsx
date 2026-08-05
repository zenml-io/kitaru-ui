import { FlowsContainer } from "@zenml/shared-kitaru/modules/flows";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { compactPartial } from "@/shared/utils/compact-partial";
import { sortBySchema } from "@zenml/shared-kitaru/utils/sorting";
import {
	Link,
	type SearchSchemaInput,
	createFileRoute,
	stripSearchParams,
	useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";

import { PageSpinner } from "@zenml/shared-kitaru/ui/spinner";
import {
	ALLOWED_FLOWS_SORT_FIELDS,
	DEFAULT_FLOWS_SORT,
	FlowsRouteProvider,
	flowStatusFilterValues,
	flowsQueries,
	type FlowLinkProps,
	type FlowStatusFilter,
	type FlowsRouteState,
} from "@zenml/shared-kitaru/modules/flows";

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
	component: FlowsRouteAdapter,
	head: () => ({
		meta: [{ title: buildPageTitles("Agents") }],
	}),
	pendingComponent: PageSpinner,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(
			flowsQueries.list(
				{
					params: deps,
				},
				context
			)
		);
	},
	loaderDeps: ({ search }) => ({
		name: search.q,
		status: search.status,
		sort: search.sort,
	}),
});

function LinkToFlow({ flowId, children, className }: FlowLinkProps) {
	return (
		<Link to="/flows/$flowId" params={{ flowId }} className={className}>
			{children}
		</Link>
	);
}

function FlowsRouteAdapter() {
	const { q, status, sort } = Route.useSearch();
	const navigate = useNavigate();

	function updateSearch(next: Partial<FlowsRouteState>) {
		navigate({
			to: "/flows",
			search: { q, status, sort, ...compactPartial(next) },
			replace: true,
		});
	}

	return (
		<FlowsRouteProvider
			state={{ q, status, sort }}
			navigation={{ updateSearch, LinkToFlow }}
		>
			<FlowsContainer />
		</FlowsRouteProvider>
	);
}
