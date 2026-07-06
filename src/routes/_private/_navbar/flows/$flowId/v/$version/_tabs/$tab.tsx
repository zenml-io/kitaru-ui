import { buildPageTitles } from "@/shared/utils/build-page-titles";
import {
	Link,
	createFileRoute,
	notFound,
	stripSearchParams,
	useNavigate,
	type SearchSchemaInput,
} from "@tanstack/react-router";
import {
	DeploymentExecutionsListContainer,
	FlowInvocationContainer,
} from "@zenml/shared-kitaru/modules/deployments";
import {
	EXECUTIONS_RANGE_VALUES,
	FLOW_EXECUTIONS_ALLOWED_SORT_FIELDS,
	FLOW_EXECUTIONS_SEARCH_DEFAULTS,
	FlowExecutionsRouteProvider,
	executionStatusFilterValues,
	type ExecutionLinkProps,
} from "@zenml/shared-kitaru/modules/executions";
import {
	flowTabLabels,
	flowTabs,
	type FlowTab,
} from "@zenml/shared-kitaru/modules/flows";
import { PageSpinner } from "@zenml/shared-kitaru/ui/spinner";
import { optionalFilterString } from "@zenml/shared-kitaru/utils/search-filter";
import { sortBySchema } from "@zenml/shared-kitaru/utils/sorting";
import { z } from "zod";

function isFlowTab(value: string): value is FlowTab {
	return (flowTabs as readonly string[]).includes(value);
}

const flowExecutionsSearchSchema = z.object({
	status: z
		.enum(executionStatusFilterValues)
		.catch(FLOW_EXECUTIONS_SEARCH_DEFAULTS.status),
	stack: optionalFilterString(),
	range: z
		.enum(EXECUTIONS_RANGE_VALUES)
		.catch(FLOW_EXECUTIONS_SEARCH_DEFAULTS.range),
	q: z.string().catch(FLOW_EXECUTIONS_SEARCH_DEFAULTS.q),
	page: z.coerce
		.number()
		.int()
		.min(1)
		.catch(FLOW_EXECUTIONS_SEARCH_DEFAULTS.page),
	sort: sortBySchema([...FLOW_EXECUTIONS_ALLOWED_SORT_FIELDS]).catch(
		FLOW_EXECUTIONS_SEARCH_DEFAULTS.sort
	),
});

type FlowExecutionsSearchInput = SearchSchemaInput & {
	status?: string;
	stack?: string;
	range?: string;
	q?: string;
	page?: number;
	sort?: string;
};

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/$tab"
)({
	params: {
		parse: ({ tab, ...rest }) => {
			if (!isFlowTab(tab)) throw notFound();
			return { ...rest, tab };
		},
		stringify: ({ tab, ...rest }) => ({ ...rest, tab: String(tab) }),
	},
	validateSearch: (search: FlowExecutionsSearchInput) =>
		flowExecutionsSearchSchema.parse(search),
	search: {
		middlewares: [stripSearchParams(FLOW_EXECUTIONS_SEARCH_DEFAULTS)],
	},
	// No `loader` on purpose: the executions tab loads in-component
	// (useFlowExecutions → useQuery + keepPreviousData + in-table skeleton) so
	// filter/page changes don't trigger route-level suspense. The global
	// /executions route uses a loader + useSuspenseQuery — that divergence is
	// intentional, not an oversight.
	component: TabComponent,
	pendingComponent: PageSpinner,
	head: ({ params }) => ({
		meta: [{ title: buildPageTitles(flowTabLabels[params.tab]) }],
	}),
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

function ExecutionsTabAdapter() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const { flowId, version } = Route.useParams();

	function redirectToFlow(targetFlowId: string) {
		void navigate({ to: "/flows/$flowId", params: { flowId: targetFlowId } });
	}

	function updateSearch(next: Partial<typeof search>) {
		void navigate({
			to: ".",
			search: (prev) => ({ ...prev, ...next }),
			replace: true,
		});
	}

	function clearFilters() {
		void navigate({
			to: ".",
			search: (prev) => ({ sort: prev.sort }),
			replace: true,
		});
	}

	function goToCompare(executionIds: string[]) {
		void navigate({
			to: "/flows/$flowId/v/$version/compare",
			params: { flowId, version },
			search: { executions: executionIds.join(",") },
		});
	}

	return (
		<FlowExecutionsRouteProvider
			state={search}
			navigation={{
				LinkToExecution,
				redirectToFlow,
				updateSearch,
				clearFilters,
				goToCompare,
			}}
		>
			<DeploymentExecutionsListContainer />
		</FlowExecutionsRouteProvider>
	);
}

function TabComponent() {
	const { tab } = Route.useParams();
	switch (tab) {
		case "invoke":
			return <FlowInvocationContainer />;
		case "executions":
			return <ExecutionsTabAdapter />;
	}
}
