import { test, expect } from "../fixtures/test";
import { makeExecution, makeDagResponse, makePipeline } from "../fixtures/api";

const FLOW_ID = "22222222-2222-2222-2222-222222222222";
const OLD_EXECUTION_ID = "11111111-1111-1111-1111-111111111111";
const NEW_EXECUTION_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const SNAPSHOT_ID = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

const emptyPage = {
	index: 1,
	max_size: 10000,
	total_pages: 1,
	total: 0,
	items: [],
};

const runnableDeployment = {
	id: SNAPSHOT_ID,
	name: "kitaru::demo-flow::v1",
	body: {
		created: "2024-01-01T00:00:00Z",
		updated: "2024-01-01T00:00:00Z",
		project_id: "00000000-0000-0000-0000-000000000000",
		runnable: true,
		deployable: true,
		is_dynamic: false,
	},
};

const oldExecution = makeExecution({
	id: OLD_EXECUTION_ID,
	body: { index: 7 },
	resources: { snapshot: runnableDeployment },
});

const replayedExecution = makeExecution({
	id: NEW_EXECUTION_ID,
	body: { index: 8 },
	resources: { snapshot: runnableDeployment },
});

test("replay from execution details redirects to the new execution", async ({
	page,
	mockApi,
	authenticatedPage,
}) => {
	void authenticatedPage;

	let wasReplayed = false;

	await mockApi({
		"/api/v1/pipelines": {
			get: {
				index: 1,
				max_size: 1000,
				total_pages: 1,
				total: 1,
				items: [makePipeline({ id: FLOW_ID, name: "demo-flow" })],
			},
		},
		"/api/v1/pipelines/{pipeline_id}": {
			get: makePipeline({ id: FLOW_ID, name: "demo-flow" }),
		},
		"/api/v1/runs": {
			get: () => ({
				index: 1,
				max_size: 1000,
				total_pages: 1,
				total: wasReplayed ? 2 : 1,
				items: wasReplayed ? [replayedExecution, oldExecution] : [oldExecution],
			}),
		},
		"/api/v1/runs/{run_id}": {
			get: ({ pathParams }) =>
				pathParams.run_id === NEW_EXECUTION_ID
					? replayedExecution
					: oldExecution,
		},
		"/api/v1/runs/{run_id}/dag": {
			get: ({ pathParams }) =>
				pathParams.run_id === NEW_EXECUTION_ID
					? makeDagResponse({
							id: NEW_EXECUTION_ID,
							status: "running",
						})
					: makeDagResponse({
							id: OLD_EXECUTION_ID,
							status: "completed",
						}),
		},
		"/api/v1/runs/{run_id}/replay": {
			post: () => {
				wasReplayed = true;
				return replayedExecution;
			},
		},
		"/api/v1/artifact_versions": { get: emptyPage },
		"/api/v1/pipeline_snapshots": { get: emptyPage },
	});

	await page.goto(`/flows/${FLOW_ID}/v/local/executions/${OLD_EXECUTION_ID}`);

	await expect(page).toHaveURL(
		`/flows/${FLOW_ID}/v/local/executions/${OLD_EXECUTION_ID}`
	);

	await page.getByRole("button", { name: "Replay" }).first().click();
	await expect(page.getByText("Replay Execution #7")).toBeVisible();

	const replayDialog = page.getByRole("dialog");
	await replayDialog.getByRole("button", { name: "Replay" }).click();

	await expect(page).toHaveURL(
		`/flows/${FLOW_ID}/v/local/executions/${NEW_EXECUTION_ID}`
	);
});
