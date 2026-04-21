// e2e/specs/secrets.spec.ts
import { test, expect } from "../fixtures/test";
import { makeSecret, makeSecretsPage } from "../fixtures/api";
import { getRequests } from "../helpers/mock-api";

const SECRET_ID = "11111111-1111-1111-1111-111111111111";

test.describe("secrets > list", () => {
	test.beforeEach(async ({ mockApi, authenticatedPage }) => {
		void authenticatedPage;
		await mockApi({
			"/api/v1/secrets": {
				get: makeSecretsPage([
					makeSecret({ id: SECRET_ID, name: "alpha-secret" }),
					makeSecret({
						id: "22222222-2222-2222-2222-222222222222",
						name: "beta-secret",
					}),
				]),
			},
		});
	});

	test("renders secrets list", async ({ page }) => {
		await page.goto("/settings/secrets");

		await expect(page.getByText("alpha-secret")).toBeVisible();
		await expect(page.getByText("beta-secret")).toBeVisible();
	});

	test("filters by search input", async ({ page }) => {
		await page.goto("/settings/secrets");

		await page.getByPlaceholder("Search...").fill("beta");

		await expect(page.getByText("beta-secret")).toBeVisible();
		await expect(page.getByText("alpha-secret")).not.toBeVisible();
	});
});

test.describe("secrets > create", () => {
	test.beforeEach(async ({ mockApi, authenticatedPage }) => {
		void authenticatedPage;
		await mockApi({
			"/api/v1/secrets": { get: makeSecretsPage([]) },
		});
	});

	test("creates a new secret (happy path)", async ({ page, mockApi }) => {
		await mockApi({
			"/api/v1/secrets": {
				post: makeSecret({ id: SECRET_ID, name: "my-new-secret" }),
			},
		});
		await page.goto("/settings/secrets");
		await page.getByRole("button", { name: "Add secret" }).click();
		await page.getByLabel("Secret name").fill("my-new-secret");
		await page.getByPlaceholder("Key").fill("api_key");
		await page.getByPlaceholder("Value").fill("hunter2");

		await page.getByRole("button", { name: "Register Secret" }).click();

		await expect(page.getByText("Secret created")).toBeVisible();
		const post = getRequests(page).find(
			(r) => r.method === "post" && r.template === "/api/v1/secrets"
		);
		expect(post).toBeDefined();
		expect(post!.body).toMatchObject({
			name: "my-new-secret",
			values: { api_key: "hunter2" },
		});
	});

	test("rejects submit when no keys are provided", async ({ page }) => {
		await page.goto("/settings/secrets");
		await page.getByRole("button", { name: "Add secret" }).click();
		await page.getByLabel("Secret name").fill("empty-secret");

		await page.getByRole("button", { name: "Register Secret" }).click();

		await expect(page.getByText("Add at least one key.")).toBeVisible();
		const post = getRequests(page).find(
			(r) => r.method === "post" && r.template === "/api/v1/secrets"
		);
		expect(post).toBeUndefined();
	});
});

test.describe("secrets > detail", () => {
	test("shows 404 when secret is missing", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;

		await mockApi({
			"/api/v1/secrets": { get: makeSecretsPage([]) },
			"/api/v1/secrets/{secret_id}": {
				get: { status: 404, body: { detail: "Not found" } },
			},
		});

		await page.goto(`/settings/secrets/${SECRET_ID}`);

		await expect(page.getByText("Page not found")).toBeVisible();
	});
});

test.describe("secrets > edit", () => {
	test("PUT body includes name and values when removing a key (regression)", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;

		const secret = makeSecret({
			id: SECRET_ID,
			name: "multi-key-secret",
			body: {
				created: "2024-01-01T00:00:00Z",
				updated: "2024-01-01T00:00:00Z",
				values: { keep_me: "a", drop_me: "b" },
			},
		});
		await mockApi({
			"/api/v1/secrets": { get: makeSecretsPage([secret]) },
			"/api/v1/secrets/{secret_id}": {
				get: secret,
				put: secret,
			},
		});
		await page.goto(`/settings/secrets/${SECRET_ID}`);
		await page.getByRole("button", { name: "Delete key drop_me" }).click();
		const keyDialog = page.getByRole("alertdialog");
		await keyDialog.getByLabel(/Type DELETE to confirm/i).fill("DELETE");

		await keyDialog.getByRole("button", { name: "Delete key" }).click();

		await expect(page.getByText("Key removed")).toBeVisible();
		const put = getRequests(page).find(
			(r) => r.method === "put" && r.template === "/api/v1/secrets/{secret_id}"
		);
		expect(put).toBeDefined();
		expect(put!.body).toMatchObject({
			name: "multi-key-secret",
			values: { keep_me: "a" },
		});
		expect(
			(put!.body as { values: Record<string, string> }).values
		).not.toHaveProperty("drop_me");
	});
});

test.describe("secrets > delete", () => {
	test("deletes secret and returns to list", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;

		const secret = makeSecret({ id: SECRET_ID, name: "doomed-secret" });
		await mockApi({
			"/api/v1/secrets/{secret_id}": {
				get: secret,
				delete: { status: 200 },
			},
			"/api/v1/secrets": {
				get: makeSecretsPage([]),
			},
		});
		await page.goto(`/settings/secrets/${SECRET_ID}`);
		await page
			.getByRole("button", { name: "Delete secret", exact: true })
			.click();
		const dialog = page.getByRole("alertdialog");
		await dialog.getByLabel(/Type DELETE to confirm/i).fill("DELETE");

		await dialog.getByRole("button", { name: "Delete secret" }).click();

		await expect(page).toHaveURL("/settings/secrets");
		const del = getRequests(page).find(
			(r) =>
				r.method === "delete" && r.template === "/api/v1/secrets/{secret_id}"
		);
		expect(del).toBeDefined();
		expect(del!.pathParams.secret_id).toBe(SECRET_ID);
	});
});
