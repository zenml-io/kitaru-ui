import { test, expect } from "../fixtures/test";
import {
	makeApiKey,
	makeApiKeyPage,
	makeServiceAccount,
	makeServiceAccountPage,
} from "../fixtures/api";
import { getRequests } from "../helpers/mock-api";

const SA_ID = "sa-11111111-1111-1111-1111-111111111111";
const KEY_ID = "ak-11111111-1111-1111-1111-111111111111";

test.describe("api keys > empty state", () => {
	test("renders empty state when no personal SA exists", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;
		await mockApi({
			"/api/v1/service_accounts": { get: makeServiceAccountPage([]) },
		});
		await page.goto("/settings/api-keys");

		await expect(page.getByText("Create a new API key")).toBeVisible();
	});
});

test.describe("api keys > list", () => {
	test("renders existing keys", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;
		await mockApi({
			"/api/v1/service_accounts": {
				get: makeServiceAccountPage([makeServiceAccount({ id: SA_ID })]),
			},
			"/api/v1/service_accounts/{service_account_id}/api_keys": {
				get: makeApiKeyPage([
					makeApiKey({ id: KEY_ID, name: "prod-ci" }),
					makeApiKey({
						id: "ak-22222222-2222-2222-2222-222222222222",
						name: "staging-ci",
					}),
				]),
			},
		});
		await page.goto("/settings/api-keys");

		await expect(page.getByText("prod-ci")).toBeVisible();
		await expect(page.getByText("staging-ci")).toBeVisible();
	});
});

test.describe("api keys > create (happy path, provisions hidden SA)", () => {
	test("creates key, shows plaintext, closes dialog", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;
		const created = makeApiKey({
			id: KEY_ID,
			name: "my-new-key",
			body: {
				created: "2026-01-01T00:00:00Z",
				updated: "2026-01-01T00:00:00Z",
				active: true,
				key: "ZENML_SK_PLAINTEXT_VALUE",
				service_account: makeServiceAccount({ id: SA_ID }),
			},
		});
		await mockApi({
			"/api/v1/service_accounts": {
				get: makeServiceAccountPage([]),
				post: makeServiceAccount({ id: SA_ID }),
			},
			"/api/v1/service_accounts/{service_account_id}/api_keys": {
				get: makeApiKeyPage([]),
				post: created,
			},
		});
		await page.goto("/settings/api-keys");
		await page.getByRole("button", { name: "Create API key" }).first().click();
		await page.getByLabel("Name").fill("my-new-key");

		await page
			.getByRole("button", { name: "Create API key", exact: true })
			.click();

		await expect(
			page.getByText("ZENML_SK_PLAINTEXT_VALUE", { exact: true })
		).toBeVisible();
		const postSa = getRequests(page).find(
			(r) => r.method === "post" && r.template === "/api/v1/service_accounts"
		);
		expect(postSa).toBeDefined();
		const postKey = getRequests(page).find(
			(r) =>
				r.method === "post" &&
				r.template === "/api/v1/service_accounts/{service_account_id}/api_keys"
		);
		expect(postKey).toBeDefined();
		expect(postKey!.body).toMatchObject({ name: "my-new-key" });

		await page.getByRole("button", { name: "Done" }).click();
		await expect(page.getByText("ZENML_SK_PLAINTEXT_VALUE")).not.toBeVisible();
	});
});

test.describe("api keys > rotate", () => {
	test("rotate with retention sends retain_period_minutes", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;
		const rotated = makeApiKey({
			id: KEY_ID,
			name: "prod-ci",
			body: {
				created: "2026-01-01T00:00:00Z",
				updated: "2026-02-01T00:00:00Z",
				active: true,
				key: "ZENML_SK_ROTATED",
				service_account: makeServiceAccount({ id: SA_ID }),
			},
		});
		await mockApi({
			"/api/v1/service_accounts": {
				get: makeServiceAccountPage([makeServiceAccount({ id: SA_ID })]),
			},
			"/api/v1/service_accounts/{service_account_id}/api_keys": {
				get: makeApiKeyPage([makeApiKey({ id: KEY_ID, name: "prod-ci" })]),
			},
			"/api/v1/service_accounts/{service_account_id}/api_keys/{api_key_name_or_id}/rotate":
				{ put: rotated },
		});
		await page.goto("/settings/api-keys");
		await page
			.getByRole("button", { name: "Open actions for prod-ci" })
			.click();
		await page.getByRole("menuitem", { name: "Rotate" }).click();
		await page
			.getByRole("switch", {
				name: "Keep the old key active for a retention period",
			})
			.click();
		await page.getByLabel("Retention period (minutes)").fill("15");

		await page.getByRole("button", { name: "Rotate key" }).click();

		await expect
			.poll(
				() =>
					getRequests(page).find(
						(r) =>
							r.method === "put" &&
							r.template ===
								"/api/v1/service_accounts/{service_account_id}/api_keys/{api_key_name_or_id}/rotate"
					),
				{ timeout: 5000 }
			)
			.toBeDefined();
		const rotateReq = getRequests(page).find(
			(r) =>
				r.method === "put" &&
				r.template ===
					"/api/v1/service_accounts/{service_account_id}/api_keys/{api_key_name_or_id}/rotate"
		);
		expect(rotateReq!.body).toMatchObject({ retain_period_minutes: 15 });
		expect(rotateReq!.pathParams.service_account_id).toBe(SA_ID);
		expect(rotateReq!.pathParams.api_key_name_or_id).toBe(KEY_ID);
	});
});

test.describe("api keys > delete", () => {
	test("type-to-confirm deletes the key", async ({
		page,
		mockApi,
		authenticatedPage,
	}) => {
		void authenticatedPage;
		await mockApi({
			"/api/v1/service_accounts": {
				get: makeServiceAccountPage([makeServiceAccount({ id: SA_ID })]),
			},
			"/api/v1/service_accounts/{service_account_id}/api_keys": {
				get: makeApiKeyPage([makeApiKey({ id: KEY_ID, name: "prod-ci" })]),
			},
			"/api/v1/service_accounts/{service_account_id}/api_keys/{api_key_name_or_id}":
				{ delete: { status: 200 } },
		});
		await page.goto("/settings/api-keys");
		await page
			.getByRole("button", { name: "Open actions for prod-ci" })
			.click();
		await page.getByRole("menuitem", { name: "Delete" }).click();
		const dialog = page.getByRole("alertdialog");
		await dialog.getByLabel(/Type DELETE to confirm/i).fill("DELETE");

		await dialog.getByRole("button", { name: "Delete API key" }).click();

		await expect(page.getByText("API key deleted")).toBeVisible();
		const del = getRequests(page).find(
			(r) =>
				r.method === "delete" &&
				r.template ===
					"/api/v1/service_accounts/{service_account_id}/api_keys/{api_key_name_or_id}"
		);
		expect(del).toBeDefined();
		expect(del!.pathParams.api_key_name_or_id).toBe(KEY_ID);
	});
});
