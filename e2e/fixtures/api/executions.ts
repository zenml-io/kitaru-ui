import type { components } from "@/shared/api/openapi";
import { makeUser } from "./current-user";

type PipelineRunResponse = components["schemas"]["PipelineRunResponse"];
type PipelineRunResponseBody = components["schemas"]["PipelineRunResponseBody"];
type PipelineRunResponseResources =
	components["schemas"]["PipelineRunResponseResources"];
type LogsResponse = components["schemas"]["LogsResponse"];
type LogsResponseBody = components["schemas"]["LogsResponseBody"];
type LogEntry = components["schemas"]["LogEntry"];
type Node = components["schemas"]["Node"];
type StepRunResponse = components["schemas"]["StepRunResponse"];
type StepRunResponseBody = components["schemas"]["StepRunResponseBody"];
type StepRunResponseResources =
	components["schemas"]["StepRunResponseResources"];

type LogsResponseOverrides = Partial<Omit<LogsResponse, "body">> & {
	body?: Partial<LogsResponseBody>;
};

type ExecutionOverrides = Partial<
	Omit<PipelineRunResponse, "body" | "resources">
> & {
	body?: Partial<PipelineRunResponseBody>;
	resources?: Partial<PipelineRunResponseResources>;
};

type CheckpointOverrides = Partial<
	Omit<StepRunResponse, "body" | "resources">
> & {
	body?: Partial<StepRunResponseBody>;
	resources?: Partial<StepRunResponseResources>;
};

const DEFAULT_CHECKPOINT_ID = "33333333-3333-3333-3333-333333333333";

const DEFAULT_EXECUTION_ID = "11111111-1111-1111-1111-111111111111";
const DEFAULT_EXECUTION_NAME = "demo-execution";

export function makeLogsResponse(
	overrides: LogsResponseOverrides = {}
): LogsResponse {
	const { body: bodyOverrides, ...rest } = overrides;
	return {
		id: "99999999-9999-9999-9999-999999999991",
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
			project_id: "00000000-0000-0000-0000-000000000000",
			source: "stdout",
			...bodyOverrides,
		},
		...rest,
	};
}

export function makeExecution(
	overrides: ExecutionOverrides = {}
): PipelineRunResponse {
	const {
		body: bodyOverrides,
		resources: resourceOverrides,
		...rest
	} = overrides;
	return {
		id: DEFAULT_EXECUTION_ID,
		name: DEFAULT_EXECUTION_NAME,
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
			project_id: "00000000-0000-0000-0000-000000000000",
			status: "completed",
			in_progress: false,
			index: 0,
			...bodyOverrides,
		},
		resources: {
			tags: [],
			log_collection: [
				makeLogsResponse({ body: { source: "stdout" } }),
				makeLogsResponse({
					id: "99999999-9999-9999-9999-999999999992",
					body: { source: "stderr" },
				}),
			],
			user: makeUser(),
			...resourceOverrides,
		},
		...rest,
	};
}

export function makeLogEntry(overrides: Partial<LogEntry> = {}): LogEntry {
	return {
		timestamp: "2024-01-01T00:00:00Z",
		level: 20, // INFO
		message: "Log message",
		...overrides,
	};
}

export function makeLogEntries(
	count: number,
	overrides: Partial<LogEntry> = {}
): LogEntry[] {
	return Array.from({ length: count }, (_, i) =>
		makeLogEntry({
			timestamp: new Date(Date.UTC(2024, 0, 1, 0, 0, i)).toISOString(),
			message: `Log line ${i + 1}`,
			...overrides,
		})
	);
}

export function makeCheckpointNode(overrides: Partial<Node> = {}): Node {
	return {
		id: DEFAULT_CHECKPOINT_ID,
		node_id: DEFAULT_CHECKPOINT_ID,
		name: "load_data",
		type: "step",
		metadata: {
			status: "completed",
			duration: 5,
			type: "step",
		},
		...overrides,
	};
}

export function makeCheckpoint(
	overrides: CheckpointOverrides = {}
): StepRunResponse {
	const {
		body: bodyOverrides,
		resources: resourceOverrides,
		...rest
	} = overrides;
	return {
		id: DEFAULT_CHECKPOINT_ID,
		name: "load_data",
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
			project_id: "00000000-0000-0000-0000-000000000000",
			status: "completed",
			version: 1,
			is_retriable: false,
			...bodyOverrides,
		},
		resources: {
			log_collection: [makeLogsResponse({ body: { source: "stdout" } })],
			...resourceOverrides,
		},
		...rest,
	};
}

type DagResponse = components["schemas"]["PipelineRunDAG"];

export function makeDagResponse(
	overrides: Partial<DagResponse> = {}
): DagResponse {
	return {
		id: "22222222-2222-2222-2222-222222222222",
		status: "completed",
		nodes: [makeCheckpointNode()],
		edges: [],
		...overrides,
	};
}
