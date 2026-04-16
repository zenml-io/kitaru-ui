// e2e/specs/smoke.spec.ts
import { test, expect } from "../fixtures/test";
import { makePipelinePage } from "../fixtures/api";

test("authenticated user is redirected to /flows and the app shell renders", async ({
	page,
	mockApi,
	authenticatedPage,
}) => {
	// authenticatedPage is a side-effect fixture (sets cookie + mocks /info and /current-user).
	// Destructuring it activates it; void suppresses the noUnusedLocals TS error.
	void authenticatedPage;

	await mockApi({
		"/api/v1/pipelines": makePipelinePage(),
	});

	await page.goto("/");

	// Root "/" redirects to "/flows" — confirms auth gate passed
	await expect(page).toHaveURL("/flows");

	// NavbarLayout's <nav> is visible — confirms React mounted and no error boundary fired
	await expect(page.getByRole("navigation")).toBeVisible();
});
