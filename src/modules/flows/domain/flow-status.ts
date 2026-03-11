export const flowStatusValues = ["running", "failed", "completed"] as const;
export const flowStatusFilterValues = ["all", ...flowStatusValues] as const;

export type FlowStatus = (typeof flowStatusValues)[number];
export type FlowStatusFilter = (typeof flowStatusFilterValues)[number];

export type FlowStatusFilterOption = {
	label: string;
	value: FlowStatusFilter;
};

// TODO: Add statuses from the API
export const flowStatusFilterOptions: FlowStatusFilterOption[] = [
	{ label: "All", value: "all" },
	{ label: "Running", value: "running" },
	{ label: "Failed", value: "failed" },
	{ label: "Completed", value: "completed" },
];
