import { test, expect } from "../fixtures/test";
import {
	makeBuild,
	makeBuildItem,
	makeCheckpoint,
	makeDagResponse,
	makeExecution,
	makePipeline,
	makeStack,
} from "../fixtures/api";

const FLOW_ID = "22222222-2222-2222-2222-222222222222";
const EXECUTION_ID = "11111111-1111-1111-1111-111111111111";
const CHECKPOINT_ID = "33333333-3333-3333-3333-333333333333";
const STACK_ID = "55555555-5555-5555-5555-555555555555";
const BUILD_ID = "77777777-7777-7777-7777-777777777777";

const executionUrl = `/flows/${FLOW_ID}/v/local/executions/${EXECUTION_ID}`;

const emptyPage = {
	index: 1,
	max_size: 10000,
	total_pages: 1,
	total: 0,
	items: [],
};

const executionWithStackAndBuild = makeExecution({
	resources: {
		stack: { id: STACK_ID } as never,
		build: { id: BUILD_ID } as never,
	},
});

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
				items: [executionWithStackAndBuild],
			},
		},
		"/api/v1/runs/{run_id}": { get: executionWithStackAndBuild },
		"/api/v1/runs/{run_id}/dag": { get: makeDagResponse() },
		"/api/v1/steps/{step_id}": { get: makeCheckpoint({ id: CHECKPOINT_ID }) },
		"/api/v1/artifact_versions": { get: emptyPage },
		"/api/v1/pipeline_snapshots": { get: emptyPage },
	});
});

test("renders the configuration tab with stack and docker image sections", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/stacks/{stack_id}": {
			get: makeStack({
				id: STACK_ID,
				name: "production-stack",
			}),
		},
		"/api/v1/pipeline_builds/{build_id}": {
			get: makeBuild({
				id: BUILD_ID,
				metadata: {
					python_version: "3.11.7",
					images: {
						orchestrator: makeBuildItem({
							image: "docker.io/zenml-io/zenml@sha256:abcd",
							dockerfile: "FROM python:3.11\nRUN pip install zenml",
							requirements: "zenml==0.65.0",
							contains_code: true,
						}),
					},
				},
			}),
		},
	});

	await page.goto(executionUrl);

	await page
		.getByRole("button", { name: /load_data/ })
		.first()
		.click();
	await page.getByRole("button", { name: "Configuration" }).click();

	await expect(page.getByRole("button", { name: "Stack" })).toBeVisible();
	await expect(page.getByText("production-stack")).toBeVisible();
	await expect(page.getByText("Orchestrator")).toBeVisible();
	await expect(page.getByText("Artifact Store")).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Docker Image" })
	).toBeVisible();
	await expect(
		page.getByText("docker.io/zenml-io/zenml@sha256:abcd")
	).toBeVisible();
	await expect(page.getByText("Dockerfile")).toBeVisible();
	await expect(page.getByText("Requirements")).toBeVisible();
	await expect(page.getByText("3.11.7")).toBeVisible();
});

test("renders the empty state when execution has no stack or build", async ({
	page,
	mockApi,
}) => {
	await mockApi({
		"/api/v1/runs/{run_id}": { get: makeExecution() },
	});

	await page.goto(executionUrl);

	await page
		.getByRole("button", { name: /load_data/ })
		.first()
		.click();
	await page.getByRole("button", { name: "Configuration" }).click();

	await expect(page.getByText(/no configuration/i)).toBeVisible();
});
