import { FlowsContainer } from "@/modules/flows/feature/FlowsContainer";
import {
	flowStatusFilterValues,
	type FlowStatusFilter,
} from "@/modules/flows/domain/flow-status";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import {
	type SearchSchemaInput,
	createFileRoute,
	stripSearchParams,
} from "@tanstack/react-router";
import z from "zod";

const flowsSearchSchema = z.object({
	q: z.string().catch(""),
	status: z.enum(flowStatusFilterValues).catch("all"),
});

type FlowsSearchSchemaInput = SearchSchemaInput & {
	q?: string;
	status?: FlowStatusFilter;
};

export const Route = createFileRoute("/_private/_navbar/flows")({
	validateSearch: (search: FlowsSearchSchemaInput) =>
		flowsSearchSchema.parse(search),
	search: {
		middlewares: [stripSearchParams({ q: "", status: "all" })],
	},
	component: FlowsContainer,
	head: () => ({
		meta: [{ title: buildPageTitles("Flows") }],
	}),
	loader: async () => {
		return {
			crumb: {
				label: "Flows",
				href: "/flows",
			},
		};
	},
});
