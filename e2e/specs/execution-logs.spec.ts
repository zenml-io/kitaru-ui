import { test, expect } from "../fixtures/test";
import {
	makeExecution,
	makeLogEntries,
	makeDagResponse,
	makeCheckpoint,
	makePipeline,
} from "../fixtures/api";

const EXECUTION_ID = "11111111-1111-1111-1111-111111111111";
const FLOW_ID = "22222222-2222-2222-2222-222222222222";

const logsUrl = `/flows/${FLOW_ID}/executions/${EXECUTION_ID}?tab=logs`;

const emptyPage = {
	index: 1,
	max_size: 10000,
	total_pages: 1,
	total: 0,
	items: [],
};

test.beforeEach(async ({ mockApi, authenticatedPage }) => {
	void authenticatedPage;
	await mockApi({
		"/api/v1/pipelines/{pipeline_id}": {
			get: makePipeline({ id: FLOW_ID, name: "demo-flow" }),
		},
		"/api/v1/runs": {
			get: {
				index: 1,
				max_size: 1000,
				total_pages: 1,
				total: 1,
				items: [makeExecution()],
			},
		},
		"/api/v1/runs/{run_id}": { get: makeExecution() },
		"/api/v1/runs/{run_id}/dag": { get: makeDagResponse() },
		"/api/v1/runs/{run_id}/logs": { get: makeLogEntries(5) },
		"/api/v1/pipeline_snapshots": { get: emptyPage },
	});
});

test("renders execution log entries", async ({ page }) => {
	await page.goto(logsUrl);

	await expect(page.getByText("Log line 1")).toBeVisible();
	await expect(page.getByText("Log line 5")).toBeVisible();
});

test("shows empty state when no logs exist", async ({ page, mockApi }) => {
	await mockApi({
		"/api/v1/runs/{run_id}": {
			get: makeExecution({ resources: { log_collection: [] } }),
		},
		"/api/v1/runs/{run_id}/logs": { get: [] },
	});

	await page.goto(logsUrl);

	await expect(page.getByTestId("execution-logs-empty")).toBeVisible();
});

test("search filters log entries to matching messages", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "Loading data",
				},
				{
					timestamp: "2024-01-01T00:00:01Z",
					level: 20,
					message: "Training model",
				},
				{
					timestamp: "2024-01-01T00:00:02Z",
					level: 20,
					message: "Saving output",
				},
			],
		},
	});

	await page.goto(logsUrl);

	await expect(page.getByText("Loading data")).toBeVisible();
	await expect(page.getByText("Training model")).toBeVisible();

	await page.getByPlaceholder("Search logs...").fill("Training");

	await expect(page.getByText("Training model")).toBeVisible();
	await expect(page.getByText("1 of 1")).toBeVisible();
});

test("search match navigation advances through matches", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "match one",
				},
				{
					timestamp: "2024-01-01T00:00:01Z",
					level: 20,
					message: "no hit",
				},
				{
					timestamp: "2024-01-01T00:00:02Z",
					level: 20,
					message: "match two",
				},
				{
					timestamp: "2024-01-01T00:00:03Z",
					level: 20,
					message: "match three",
				},
			],
		},
	});

	await page.goto(logsUrl);
	await page.getByPlaceholder("Search logs...").fill("match");

	await expect(page.getByText("1 of 3")).toBeVisible();

	await page.getByRole("button", { name: "Next match" }).click();
	await expect(page.getByText("2 of 3")).toBeVisible();

	await page.getByRole("button", { name: "Next match" }).click();
	await expect(page.getByText("3 of 3")).toBeVisible();

	await page.getByRole("button", { name: "Previous match" }).click();
	await expect(page.getByText("2 of 3")).toBeVisible();
});

test("level filter hides entries below the selected level", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "info entry",
				},
				{
					timestamp: "2024-01-01T00:00:01Z",
					level: 20,
					message: "another info",
				},
				{
					timestamp: "2024-01-01T00:00:02Z",
					level: 40,
					message: "error entry",
				},
			],
		},
	});

	await page.goto(logsUrl);

	await expect(page.getByText("info entry")).toBeVisible();
	await expect(page.getByText("error entry")).toBeVisible();

	await page.getByRole("combobox").filter({ hasText: "All levels" }).click();
	await page.getByRole("option", { name: "Error" }).click();

	await expect(page.getByText("error entry")).toBeVisible();
	await expect(page.getByText("info entry")).not.toBeVisible();
	await expect(page.getByText("another info")).not.toBeVisible();
});

test("source selector switches visible log entries", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: ({ query }) => {
				if (query.source === "stderr") {
					return [
						{
							timestamp: "2024-01-01T00:00:00Z",
							level: 40,
							message: "stderr line 1",
						},
					];
				}
				return [
					{
						timestamp: "2024-01-01T00:00:00Z",
						level: 20,
						message: "stdout line 1",
					},
				];
			},
		},
	});

	await page.goto(logsUrl);

	await expect(page.getByText("stdout line 1")).toBeVisible();

	await page.getByRole("combobox").filter({ hasText: "stdout" }).click();
	await page.getByRole("option", { name: "stderr" }).click();

	await expect(page.getByText("stderr line 1")).toBeVisible();
	await expect(page.getByText("stdout line 1")).not.toBeVisible();
});

test("copy button writes log entries to the clipboard", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "hello world",
				},
			],
		},
	});

	await page.goto(logsUrl);

	await page.getByRole("button", { name: "Copy all logs" }).click();

	const clipboardText = await page.evaluate(() =>
		navigator.clipboard.readText()
	);
	expect(clipboardText).toContain("hello world");
	expect(clipboardText).toContain("INFO");
});

test("download button offers a .log file with the execution id", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "downloadable line",
				},
			],
		},
	});

	await page.goto(logsUrl);

	const [download] = await Promise.all([
		page.waitForEvent("download"),
		page.getByRole("button", { name: "Download logs" }).click(),
	]);

	expect(download.suggestedFilename()).toBe(`execution-${EXECUTION_ID}.log`);
});

test("scope sidebar switches between execution and checkpoint logs", async ({
	page,
	mockApi,
}) => {
	const CHECKPOINT_ID = "33333333-3333-3333-3333-333333333333";

	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "execution-level line",
				},
			],
		},
		"/api/v1/steps/{step_id}": {
			get: makeCheckpoint({ id: CHECKPOINT_ID }),
		},
		"/api/v1/steps/{step_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "checkpoint-level line",
				},
			],
		},
	});

	await page.goto(logsUrl);
	await expect(page.getByText("execution-level line")).toBeVisible();

	const scopeNav = page.getByRole("navigation", { name: "Log scope" });
	await scopeNav.getByRole("button", { name: "load_data" }).click();

	await expect(page.getByText("checkpoint-level line")).toBeVisible();
	await expect(page).toHaveURL(new RegExp(`scope=${CHECKPOINT_ID}`));

	await scopeNav.getByRole("button", { name: /^Execution #/ }).click();

	await expect(page.getByText("execution-level line")).toBeVisible();
	await expect(page).not.toHaveURL(new RegExp(`scope=${CHECKPOINT_ID}`));
});

test("shows error state with retry when logs endpoint fails", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: { status: 500, body: { detail: "boom" } },
		},
	});

	await page.goto(logsUrl);

	await expect(page.getByTestId("execution-logs-error")).toBeVisible();

	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "after retry",
				},
			],
		},
	});

	await page.getByRole("button", { name: "Retry" }).click();

	await expect(page.getByText("after retry")).toBeVisible();
	await expect(page.getByTestId("execution-logs-error")).not.toBeVisible();
});

test("shows stale banner when polling fails after initial success", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}": {
			get: makeExecution({ body: { status: "running" } }),
		},
		"/api/v1/runs/{run_id}/logs": {
			get: [
				{
					timestamp: "2024-01-01T00:00:00Z",
					level: 20,
					message: "initial line",
				},
			],
		},
	});

	await page.clock.install();

	await page.goto(logsUrl);
	await expect(page.getByText("initial line")).toBeVisible();

	await mockApi({
		"/api/v1/runs/{run_id}/logs": {
			get: { status: 500, body: { detail: "polling broke" } },
		},
	});

	await page.clock.fastForward(4000);

	await expect(page.getByRole("status")).toBeVisible();
});
