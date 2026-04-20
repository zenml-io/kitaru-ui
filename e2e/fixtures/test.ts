// e2e/fixtures/test.ts
import { test as base, expect } from "@playwright/test";
import { mockApi as mockApiHelper, type Mocks } from "../helpers/mock-api";
import { makeServerInfo, makeUser } from "./api";
import { E2E_BASE_URL } from "../constants";

type TestFixtures = {
	mockApi: (mocks: Mocks) => Promise<void>;
	authenticatedPage: void;
};

export const test = base.extend<TestFixtures>({
	mockApi: async ({ page }, use) => {
		await use((mocks) => mockApiHelper(page, mocks));
	},

	authenticatedPage: [
		async ({ page, mockApi }, use) => {
			await page
				.context()
				.addCookies([
					{ name: "session", value: "e2e-fake", url: E2E_BASE_URL },
				]);
			await mockApi({
				"/api/v1/info": { get: makeServerInfo() },
				"/api/v1/current-user": { get: makeUser() },
			});
			await use();
		},
		{ auto: false },
	],
});

export { expect };
