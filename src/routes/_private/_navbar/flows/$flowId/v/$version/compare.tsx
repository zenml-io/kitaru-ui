import { createFileRoute } from "@tanstack/react-router";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { z } from "zod";
import { ExecutionComparisonContainer } from "@zenml/shared-kitaru/modules/executions";
import { buildPageTitles } from "@/shared/utils/build-page-titles";

const compareSearchSchema = z.object({
	executions: z.string().catch(""),
});

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/compare"
)({
	validateSearch: (search: { executions?: string } & SearchSchemaInput) =>
		compareSearchSchema.parse(search),
	loader: () => ({
		crumb: {
			label: "Compare executions",
			disabled: false,
		},
	}),
	component: CompareComponent,
	head: () => ({
		meta: [{ title: buildPageTitles("Compare executions") }],
	}),
});

function CompareComponent() {
	const { executions } = Route.useSearch();
	const executionIds = executions
		? executions.split(",").filter(Boolean)
		: [];
	return <ExecutionComparisonContainer executionIds={executionIds} />;
}
