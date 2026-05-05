# AGENTS.md

This file provides guidance to AI coding agents (Codex, Cursor, Claude, etc.) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
pnpm install          # Install dependencies (uses pnpm, not yarn!)
pnpm dev              # Start development server (default port 5173)
pnpm build            # Build for production (tsc + vite build)
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm test:unit        # Run unit tests (Vitest)
pnpm test:e2e          # Run e2e tests headless (requires pnpm build first)
pnpm test:e2e:ui       # Interactive Playwright UI mode — use this when writing tests
pnpm test:e2e:install  # One-time: download Chromium browser (~150MB)
pnpm preview          # Preview the production build locally
pnpm generate:types   # Generate OpenAPI types: pnpm generate:types -- <base-url>
```

### Authentication & Proxy

By default, API requests are relative (`/api/v1/...`). In development, the Vite dev server proxies `/api` requests to `VITE_BACKEND_URL` (default `http://localhost:8237`) so frontend and backend appear on the same origin. For cross-origin deployments, set `VITE_API_BASE_URL` to an absolute backend origin (for example `https://backend.test.com`) and ensure backend CORS/cookie settings allow credentialed requests from the frontend origin.

## Architecture Overview

### Technology Stack

- **Framework:** Vite 8 + React 19 (SPA)
- **Routing:** @tanstack/react-router (file-based with auto code-splitting)
- **Server state:** @tanstack/react-query
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **UI primitives:** Base UI (`@base-ui/react`) + class-variance-authority, with shadcn-style config conventions (`components.json`)
- **Icons:** lucide-react
- **Notifications:** Sonner
- **Theming:** next-themes
- **Type safety:** TypeScript (strict mode) with generated types from the ZenML OpenAPI spec
- **Compiler:** React Compiler (via Babel plugin)
- **Testing:** Vitest
- **Pre-commit:** Lefthook (ESLint auto-fix + Prettier on staged files)

### Project Structure

- The intended module-based structure lives under `src/modules/<module>`.
- Each module should be split by responsibility using these layers:
  - **domain/** — module-owned types (entity types and derived-state shapes used across the module), API/request functions, and API↔domain mappers (`<entity>FromApiToDomain`). Functions in this layer must operate on raw API shapes — converting them into domain types or extracting/normalizing fields off the API response. Pure functions that classify, categorize, filter, or otherwise derive from already-domain types belong in business-logic, even when their return type is defined here.
  - **business-logic/** — TanStack Query definitions, mutation hooks, and module-specific pure logic operating on domain types (classifiers, predicates, status categorizers, state derivers used by features/UI).
  - **feature/** — stateful containers, provider composition, and feature entrypoints
  - **util/** — small module-scoped utilities
  - **ui/** — stateless presentational components
- Keep modules split by layer from the start rather than growing a flat module and reorganizing later.

**Layer import rules** — each layer may only import from layers marked ✅:

| Importer →         | feature | business-logic |     domain      | ui  | util |
| ------------------ | :-----: | :------------: | :-------------: | :-: | :--: |
| **feature**        |   ✅    |       ✅       |       ✅        | ✅  |  ✅  |
| **business-logic** |   ❌    |       ✅       |       ✅        | ❌  |  ✅  |
| **domain**         |   ❌    |       ❌       |       ✅        | ❌  |  ✅  |
| **ui**             |   ❌    |       ❌       | ✅ (types only) | ✅  |  ✅  |
| **util**           |   ❌    |       ❌       |       ❌        | ❌  |  ✅  |

- `src/routes/*` — file-based TanStack Router route definitions; these contain `beforeLoad` logic for data preloading and redirects, plus page metadata
- `src/shared/api/domain/*` — transport layer: `apiClient` and the `FetchError` class
- `src/shared/api/utils/*` — API-specific helpers such as CSRF cookie lookup, response unwrapping, and error response handling
- `src/shared/api/openapi.d.ts` — generated OpenAPI types (do not hand-edit)
- `src/shared/api/*` must not import router concerns (`notFound`, route context, etc.); keep router-aware helpers in `src/shared/router/` or module layers
- `src/shared/router/utils/*` — shared router-aware helpers (e.g. `ensureQueryDataOr404`). If you encounter older imports from `src/shared/api/utils/handle-404`, prefer the router helper for new work because it throws TanStack Router's `notFound()`.
- `src/shared/ui/*` — reusable UI primitives built on Base UI; these are the shadcn-managed surface referenced by `components.json`
- `src/shared/utils/*` — shared utilities (`styles.ts` for `cn()`, `build-page-titles.ts`)
- Root Module bootstrap code (`queryClient`, root providers) belongs in `src/modules/root/`
- Root Module global resources (server info, session, config) belong in `src/modules/root/domain/*`
- Assets (icons/images) live in `src/assets` and can be imported as React components via SVGR

### Generated Files

Two files are auto-generated. Do not hand-edit them:

- `src/routeTree.gen.ts` — generated by the TanStack Router Vite plugin from `src/routes/`
- `src/shared/api/openapi.d.ts` — generated by `pnpm generate:types` from the ZenML OpenAPI spec

`src/routeTree.gen.ts` is excluded from ESLint. The generated OpenAPI declaration file is still part of the TypeScript source tree so schema drift is caught by type-checking and tests.

## General Best Practices

- Prefer composition over inheritance
- Keep components focused; lift state only as needed
- Use component variants (via `cva`) for styling variations rather than inline conditionals
- Prefer writing Tailwind classes in the `ui` layer, but feature/layout shells may use them when intentional
- Keep `feature/` components as thin orchestrators: they wire data and compose UI, but delegate markup and styling to `ui/` components. If a feature component is growing Tailwind-heavy JSX, extract presentational pieces to `ui/`
- Avoid duplicating code or inventing hyper-generic abstractions: inspect existing flows before writing new components or helpers
- Prefer focused components over catch-all versions; duplicating two purposeful components is often clearer than a single complex abstraction
- Reference existing implementations for similar features

### Data Fetching Pattern

All API interactions follow a consistent pattern. Request definitions belong to the owning module, not generic shared folders.

**Request functions** — define actual read/write API functions in `src/modules/<module>/domain/*`.

- Keep these functions focused on transport and response parsing.
- Do not export custom React Query fetcher helpers for reads when `queryOptions(...)` can express the query API directly.

**API ↔ domain mappers** — for any non-trivial transformation between API shape (OpenAPI types) and frontend domain shape, extract the transformation into a dedicated mapper function in `domain/*` using the naming convention:

- `<entity>FromApiToDomain` — e.g. `checkpointFromApiToDomain`, `logsFromApiToDomain`
- `<entity>FromDomainToApi` — used when sending a domain object back to the API (mirror of `FromApiToDomain`; add when a real write path needs it)

Trivial pass-throughs don't need a mapper — e.g. returning the API array unchanged, or renaming a single field — those can stay inline in the fetch function. Only extract when there's real shape change, enrichment, or normalization.

**Queries** — define TanStack Query keys and query collections in `src/modules/<module>/business-logic/*`.

- Export grouped key factories such as `xQueryKeys`.
- Export grouped query factories such as `xQueries`.
- Build read APIs with `queryOptions(...)` or `infiniteQueryOptions(...)` so they are reusable from both route loaders and components.

**Mutations** — define and export mutation hooks from `src/modules/<module>/business-logic/*`.

- Keep the underlying write request function in `domain/`.
- Wrap `useMutation(...)` in a module hook (e.g. `useVerifyDevice`, `useLoginUser`).
- Return the mutation result plus domain-named aliases for `mutate`/`mutateAsync` (e.g. `verifyDevice`, `verifyDeviceAsync`) for ergonomic usage in features.
- Do not use `mutationOptions(...)` for module mutations.

Components should consume the exported module mutation hooks directly.

**Cross-module orchestration** — when a mutation needs to chain multiple domain actions (e.g. activate server then login), define that orchestration in the owning module's `feature/` layer.

**Example query:**

```typescript
// src/modules/device/business-logic/device-queries.ts
import { queryOptions } from "@tanstack/react-query";

import { fetchDevice } from "@/modules/device/domain/fetch-device";
import type { DeviceQueryParams } from "@/modules/device/domain/device-query-params";

export const deviceQueryKeys = {
	all: ["device"] as const,
	detail: (deviceId: string) => [...deviceQueryKeys.all, deviceId] as const,
};

export const deviceQueries = {
	detail: (deviceId: string, queryParams: DeviceQueryParams = {}) =>
		queryOptions({
			queryKey: [...deviceQueryKeys.detail(deviceId), queryParams],
			queryFn: () => fetchDevice(deviceId, queryParams),
		}),
};
```

**Current data loading flow:**

- Route `beforeLoad` handlers call `context.queryClient.ensureQueryData(...)` to preload data
- Components use module mutation hooks for write operations
- Global 401 handling: `QueryCache.onError` in `query-client.ts` redirects to `/login?next=...` on `FetchError` with status 401
- Mutation errors are handled locally in the form/container that triggered them

### Path Aliasing

The codebase uses `@/*` as an alias for `src/*`:

```typescript
import { apiClient } from "@/shared/api/domain/api-client";
import { deviceQueries } from "@/modules/device/business-logic/device-queries";
```

Configured in both `tsconfig.json` and `vite.config.ts` (via Vite's `resolve.tsconfigPaths` option).

### Form Handling

Forms use React Hook Form + Zod:

- Define a Zod schema in `domain/<name>-schema.ts`
- Use `zodResolver(schema)` with `useForm(...)` in the form container
- Use `Controller` for controlled field components
- Wire submission to the module's exported mutation hook
- Show errors via toast notifications (Sonner)

See `ServerActivationFormContainer.tsx` and `LoginFormContainer.tsx` for current examples in the intended naming scheme.

### Components & Styling

- Reusable UI primitives live in `src/shared/ui/*` and are built on Base UI with `cva` for variants
- `src/shared/ui/*` and `src/shared/utils/styles.ts` are shadcn-managed surfaces referenced by `components.json`; avoid refactoring them unless explicitly requested
- Icons and illustrations live in `src/assets` and can be imported as React components via SVGR
- Keep Tailwind utility classes; Prettier (with the Tailwind plugin) auto-sorts them
- Prefer focused components over overly generic abstractions
- Keep cross-module `ui/` primitives placement-agnostic: if a shared component is consumed by a different module (for example, a `logs/ui/` primitive used from `executions/feature/`), its props shouldn't name the caller — expose a generic composition slot (`leading?: ReactNode`, `children`, etc.) instead. Module-local `ui/` components used only within their own module can stay module-specific in their props

See [DESIGN.md](./DESIGN.md) for design-related guidelines.

### Coding Conventions

- Define React components with `function` declarations instead of arrow functions
- Stick to strict typing: no `any`, prefer `type` aliases, and colocate types near usage
- No type casting
- Use PascalCase for React component and context files (e.g. `Dashboard.tsx`, `DashboardContainer.tsx`, `AuthContext.tsx`)
- Suffix feature-layer smart components (stateful containers) with `Container` (e.g. `ExecutionContainer.tsx`, `LoginFormContainer.tsx`)
- Use kebab-case for hook files and start them with `use-` (e.g. `use-flow.tsx`, `use-download-artifact.ts`)
- Use kebab-case for utilities, API calls, domain-layer files, and business-logic files (e.g. `api-client.ts`, `fetch-device.ts`, `device-queries.ts`)
- Exception: route files should follow TanStack Router naming requirements when those differ (e.g. pathless/layout route conventions)
- define optional props/params like this: `selectedId?: string` instead of `selectedId: string | null` or `selectedId: string | undefined`

### Networking

- `apiClient` sends `credentials: "include"` and targets `/api/v1/...` by default
- Optional override: set `VITE_API_BASE_URL` to send requests to `<origin>/api/v1/...`
- Default headers: `Content-Type: application/json`, `Source-Context: kitaru-ui`
- Login is a special case that overrides content type to `application/x-www-form-urlencoded`
- Vite proxies `/api` to `VITE_BACKEND_URL` in development
- Non-OK responses throw `FetchError` (see `throw-fetch-error-from-response.ts`)

## Assets

- Place all icons/images in `src/assets` and import them as React components via SVGR; reuse existing assets before adding new ones

## Git Conventions

### Docs Maintenance

Before committing or pushing a PR, check whether `README.md` and `AGENTS.md` need updating to reflect your changes. Common triggers:

- New or renamed folders, modules, or routes
- Added/removed dependencies or scripts
- Changes to the data fetching, auth, or networking patterns
- New generated files or build steps

Keep both files accurate — stale docs erode trust faster than missing docs.

### PR Titles

- Use plain, descriptive titles without conventional commit prefixes (no `feat:`, `fix:`, `ci:`, etc.)
- Good: "Add workflow to require release label on PRs"
- Bad: "ci: add workflow to require release label on PRs"

## Testing

- Test files must be named `*.spec.ts` or `*.spec.tsx` and colocated next to the file they test
- Run tests with `pnpm test:unit`
- Write unit tests for non-trivial logic in `util/` and `business-logic/` layers — if a function has edge cases, branching, or data transformation that could silently break, it needs a test
- Hooks with complex state transitions or derived logic are good candidates for testing with `renderHook` from Testing Library
- Don't test presentational UI components unless they contain logic; prefer testing the logic in isolation

### E2E Tests

- E2E test files live in `e2e/specs/` and are named `*.spec.ts`
- Import `test` and `expect` from `e2e/fixtures/test.ts`, not directly from `@playwright/test`
- Use the `authenticatedPage` fixture for tests that need an authenticated session — it mocks `/api/v1/info` and `/api/v1/current-user` automatically. It is `auto: false`; Playwright activates it when it appears in the destructured parameter list. Use `void authenticatedPage` to suppress the `noUnusedLocals` TypeScript error since the fixture's type is `void` and the variable is never referenced in the test body (see the smoke test for the pattern)
- Add per-test mocks with `await mockApi({ "/api/v1/some-endpoint": fixture })` **before** calling `page.goto()` — mock-api registers the route handler lazily, and loaders run during navigation
- Any `/api/v1/*` call with no matching mock returns HTTP 500 and fails the test — add the endpoint to the mock map when you see "Unmocked endpoint: X" in output
- Factory functions for API fixture data live in `e2e/fixtures/api/` and are typed against `src/shared/api/openapi.d.ts` — TypeScript catches schema drift at compile time
- Locator priority: `getByRole` → `getByLabel` → `getByText` → `getByTestId` (last resort) — never CSS class selectors
- `pnpm build` must be run before `pnpm test:e2e` — the test server runs `pnpm preview` against `dist/`

## CI

GitHub Actions (`.github/workflows/build-validation.yml`) runs on pushes to `main` and `develop`, on all PRs, and by manual dispatch:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm build`
4. `pnpm test:unit`
5. `zizmor` audit for GitHub Actions workflow hardening

GitHub Actions also runs `.github/workflows/e2e.yml` on all PRs and pushes to `main`:

1. `pnpm install --frozen-lockfile`
2. `pnpm build`
3. Playwright Chromium install (cached in `~/.cache/ms-playwright`)
4. `pnpm test:e2e`
5. Upload `playwright-report/` artifact on failure (14-day retention)

The E2E workflow runs in parallel with `build-validation.yml`. Both must pass for PRs to merge.

### GitHub Actions hardening

- Every workflow must declare explicit `permissions:` using least privilege. Build/test workflows should normally use `contents: read`; release workflows should only request the write scopes they actually need.
- Pin all `uses:` actions to full commit SHAs, keeping a nearby version comment for human review and Dependabot maintenance.
- Set `persist-credentials: false` on `actions/checkout` unless the workflow explicitly needs persisted git credentials.
- Dependabot is configured only for the `github-actions` ecosystem and targets `develop`; do not add npm/pnpm Dependabot updates unless explicitly requested because they are intentionally avoided to reduce noise.
- CI runs `zizmor` 1.24.1 against `.github` and blocks non-informational findings (`min-severity: low`) so workflow and Dependabot changes should be checked locally with `uvx zizmor==1.24.1 --min-severity low .github` when possible.
