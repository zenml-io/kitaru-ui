# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) and Cursor when working with code in this repository.

## Development Commands

### Essential Commands

```bash
pnpm install          # Install dependencies (uses pnpm, not yarn!)
pnpm dev             # Start development server (default port 5173)
pnpm build           # Build for production (tsc + vite build)
pnpm lint            # Run ESLint
pnpm format          # Format code with Prettier
```

**Important:** The frontend and server must be on the same domain (e.g., `localhost`) for authentication to work correctly. The dashboard uses `credentials: "include"` for cookie-based auth.

## Architecture Overview

### Technology Stack

- **Framework:** Vite + React 19 (SPA)
- **Routing:** @tanstack/router
- **Data Fetching:** @tanstack/react-query
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS + Tailwind plugins (forms, typography, container-queries).
- **UI Components:** Shadcn UI with custom theme
- **State management:** React Context
- **Type Safety:** TypeScript (strict mode) with generated types from OpenAPI

### Project Structure

- Feature-based folder structure under `src/features/<feature>` with consistent layers:
  - **feature/** — page/container orchestration, provider composition, feature entrypoints; the public surface routes or other features import from
  - **domain/** — feature-owned API contracts, query definitions, mutation definitions, transformers, schemas, types; where request definitions live
  - **ui/** — pure presentational components; prefer placing Tailwind classes here, while allowing feature/layout shells when it keeps composition clearer
  - **utils/** — small feature-scoped pure helpers only
- Optional sublayers when a feature grows: `domain/queries/`, `domain/mutations/`, `domain/types/`, `feature/hooks/` (only for orchestration hooks that combine domain modules and UI state)
- `src/routes/*` — file-based TanStack Router route definitions and route composition entrypoints; keep them thin and do not use route files as targets for architecture refactors
- `src/shared/api/*` — infrastructure-only: transport primitives, path builders, errors, generated OpenAPI types
- `src/shared/api/*` must not import router concerns (`notFound`, route context, etc.); keep router-aware helpers in app/feature or router-focused shared modules
- App bootstrap modules (`queryClient`, root providers, app-wide wiring) belong in `src/features/app/feature/*`
- `src/shared/ui/*` should contain reusable primitives only; shell-specific UI should live with the owning feature
- `src/shared/ui/*` and `src/shared/utils/styles.ts` are shadcn-managed surfaces referenced by `components.json`; avoid refactors there unless explicitly requested
- App-global resources (server info, session, config) belong in `src/features/app/domain/*`
- Assets (icons/images) live in `src/assets` and can be imported as React components via SVGR. `src/contents` is legacy static copy—avoid expanding it unless absolutely required.

# General Best Practices

- Prefer composition over inheritance
- Favor the composition pattern
- Keep components focused; lift state only as needed
- Use component variants for styling variations rather than inline conditionals or Tailwind classes
- Prefer writing Tailwind classes in the `ui` layer, but feature/layout shells may use them when intentional
- Avoid duplicating code or inventing hyper-generic abstractions: inspect existing flows (and `zenml-cloud-ui`) before writing new components or helpers.
- Prefer focused components over catch-all versions; duplicating two purposeful components is often clearer than a single complex abstraction.
- Reference existing implementations for similar features
- Point to the data fetching patterns in `domain` layer
- Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

### Data Fetching Pattern

All API interactions follow a consistent pattern. Request definitions belong to the owning feature, not generic shared folders.

**Queries** — define in `src/features/<feature>/domain/queries/<name>-query.ts`:

- `getXQueryKey(...)` — query key factory
- `fetchX(...)` — async fetcher function
- `xQueryOptions(...)` — built with `queryOptions` or `infiniteQueryOptions`

Read operations must be defined with `queryOptions` / `infiniteQueryOptions` so they are reusable from both route loaders (`queryClient.ensureQueryData(...)`) and components (`useQuery(...)` / `useSuspenseQuery(...)`). Do not create custom query hooks that wrap a single query definition.

**Mutations** — define in `src/features/<feature>/domain/mutations/<name>-mutation.ts`:

- `mutateX(...)` — raw mutation function
- `xMutationOptions(...)` — optional factory built with `mutationOptions`

Components use `useMutation(xMutationOptions(...))` directly.

**Example query:**

```typescript
// src/features/app/domain/queries/server-info-query.ts
export function getServerInfoQueryKey() {
	return ["server-info"] as const;
}

export async function fetchServerInfo(): Promise<ServerInfo> {
	const response = await apiClient(apiPaths.info, { method: "GET" });
	return response.json();
}

export function serverInfoQueryOptions() {
	return queryOptions({
		queryKey: getServerInfoQueryKey(),
		queryFn: fetchServerInfo,
	});
}
```

**Usage:** loaders call `queryClient.ensureQueryData(serverInfoQueryOptions())`; components call `useSuspenseQuery(serverInfoQueryOptions())` or `useQuery(serverInfoQueryOptions())`.

### Path Aliasing

The codebase uses `@/*` as an alias for `src/*`:

```typescript
import { useAuthContext } from "@/shared/feature/AuthContext";
import { fetcher } from "@/shared/domain/fetch";
```

Configured in both `tsconfig.json` and `vite.config.ts`.

### Form Handling

Forms use React Hook Form + Zod for validation:

- Dynamic form generation from JSON Schema (see `src/lib/forms.ts`)
- Schema-to-Zod conversion for service connectors and stack components
- Form components in `src/components/form/`

### Components & Styling

- It's fine to colocate component-specific TypeScript helpers or contexts under `src/components` alongside the component; reserve `src/lib` for global/shared helpers.
- Icons and illustrations live in `src/assets` and can be imported as React components via SVGR; avoid pulling from `lucide-react`.
- Keep Tailwind utility classes; Prettier (with the Tailwind plugin) auto-sorts them.
- Prefer focused components over overly generic abstractions.

### Coding Conventions

- Define React components with `function` declarations instead of arrow functions.
- Stick to strict typing: no `any`, prefer `type` aliases, and colocate types near usage or under `src/types` (with `components` vs `operations` imports as appropriate).
- No type casting.
- Use dash-case for new file names (e.g. `verification-form.tsx`, `current-user-query.ts`, `activate-server-mutation.ts`).
- Exception: route files should follow TanStack Router naming requirements when those differ (e.g. pathless/layout route conventions).

## Assets & Content

- Place all icons/images in `src/assets` and import them as React components via SVGR; reuse existing assets before adding new ones.
- `src/contents` stores legacy static text blocks—avoid extending it unless a piece of copy truly must be centralized.

## Git Conventions

### PR Titles

- Use plain, descriptive titles without conventional commit prefixes (no `feat:`, `fix:`, `ci:`, etc.)
- Good: "Add workflow to require release label on PRs"
- Bad: "ci: add workflow to require release label on PRs"
