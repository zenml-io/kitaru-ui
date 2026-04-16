// e2e/fixtures/test.ts
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect } from "@playwright/test";
import { mockApi as mockApiHelper, type Mocks } from "../helpers/mock-api";
import { makeServerInfo, makeUser } from "./api";

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
					{ name: "session", value: "e2e-fake", url: "http://localhost:4173" },
				]);
			await mockApi({
				"/api/v1/info": makeServerInfo(),
				"/api/v1/current-user": makeUser(),
			});
			await use();
		},
		{ auto: false },
	],
});

export { expect };
