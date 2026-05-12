import { expect, test } from "../fixtures/test";

const RUN_ITEM = {
	id: "00000000-0000-0000-0000-000000000001",
	name: "run-001",
	body: {
		created: "2026-05-09T12:00:00Z",
		updated: "2026-05-09T12:00:00Z",
		status: "completed" as const,
		index: 1,
		in_progress: false,
		project_id: "00000000-0000-0000-0000-000000000000",
	},
	resources: {
		project_id: "00000000-0000-0000-0000-000000000000",
		tags: [],
		log_collection: null,
		pipeline: {
			id: "00000000-0000-0000-0000-0000000000a1",
			name: "content_pipeline",
			body: {
				created: "2026-04-17T00:00:00Z",
				updated: "2026-04-17T00:00:00Z",
				project_id: "00000000-0000-0000-0000-000000000000",
			},
		},
		stack: {
			id: "00000000-0000-0000-0000-0000000000b1",
			name: "docker-local",
			body: {
				created: "2026-04-17T00:00:00Z",
				updated: "2026-04-17T00:00:00Z",
				project_id: "00000000-0000-0000-0000-000000000000",
			},
		},
	},
};

test.describe("/executions (global)", () => {
	test("renders rows from /api/v1/runs and persists filter URL state", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;
		await mockApi({
			"/api/v1/runs": {
				get: {
					items: [RUN_ITEM],
					total: 1,
					index: 1,
					max_size: 50,
					total_pages: 1,
				},
			},
			"/api/v1/pipeline_snapshots": {
				get: {
					items: [],
					total: 0,
					index: 1,
					max_size: 1000,
					total_pages: 0,
				},
			},
			"/api/v1/pipelines": {
				get: {
					items: [],
					total: 0,
					index: 1,
					max_size: 1000,
					total_pages: 0,
				},
			},
		});

		await page.goto("/executions");
		await expect(
			page.getByRole("heading", { name: "Executions" })
		).toBeVisible();
		await expect(page.getByText("content_pipeline").first()).toBeVisible();
		await expect(page.getByText("docker-local").first()).toBeVisible();

		await page.goto("/executions?status=failed&range=24h");
		await expect(page).toHaveURL(/status=failed/);
		await expect(page).toHaveURL(/range=24h/);
	});

	test("Clear filters resets the search input and URL", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;
		await mockApi({
			"/api/v1/runs": {
				get: ({ query }) => {
					if (query.pipeline_name) {
						return {
							items: [],
							total: 0,
							index: 1,
							max_size: 50,
							total_pages: 0,
						};
					}
					return {
						items: [RUN_ITEM],
						total: 1,
						index: 1,
						max_size: 50,
						total_pages: 1,
					};
				},
			},
			"/api/v1/pipeline_snapshots": {
				get: {
					items: [],
					total: 0,
					index: 1,
					max_size: 1000,
					total_pages: 0,
				},
			},
			"/api/v1/pipelines": {
				get: {
					items: [],
					total: 0,
					index: 1,
					max_size: 1000,
					total_pages: 0,
				},
			},
		});

		await page.goto("/executions");
		await expect(page.getByText("content_pipeline").first()).toBeVisible();

		const searchInput = page.getByPlaceholder("Search #num or flow…");
		await searchInput.fill("nonexistent_flow_xyz");
		await expect(page).toHaveURL(/q=nonexistent_flow_xyz/);
		await expect(
			page.getByText("No executions match the current filters.")
		).toBeVisible();

		await page.getByRole("button", { name: "Clear filters" }).click();

		await expect(page).toHaveURL(/\/executions$/);
		await expect(searchInput).toHaveValue("");
		await expect(page.getByText("content_pipeline").first()).toBeVisible();
	});
});
