# Kitaru UI

Kitaru UI is the web dashboard for [Kitaru](https://kitaru.ai) — a durable agent infrastructure framework for Python that enables reliable agent execution with built-in crash recovery, human-in-the-loop approval, and cost tracking. It is a single-page application built with React 19 and Vite.

## Current Scope

The app currently supports:

- **Server activation** — first-run setup flow when the ZenML server has not yet been activated
- **Login / session management** — cookie-based authentication with the ZenML backend
- **Private area shell** — authenticated layout with a placeholder home page

## Tech Stack

| Layer           | Tool                                                                             |
| --------------- | -------------------------------------------------------------------------------- |
| Framework       | Vite 7 + React 19 (SPA)                                                          |
| Routing         | [@tanstack/react-router](https://tanstack.com/router) (file-based, code-split)   |
| Server state    | [@tanstack/react-query](https://tanstack.com/query)                              |
| Forms           | React Hook Form + Zod                                                            |
| Styling         | Tailwind CSS v4 (via `@tailwindcss/vite`)                                        |
| UI primitives   | [Base UI](https://base-ui.com/) + [class-variance-authority](https://cva.style/) |
| Icons           | [lucide-react](https://lucide.dev/)                                              |
| Notifications   | [Sonner](https://sonner.emilkowal.dev/)                                          |
| Theming         | next-themes                                                                      |
| Type generation | openapi-typescript (from ZenML server OpenAPI spec)                              |
| Testing         | Vitest                                                                           |
| Compiler        | React Compiler (via Babel plugin)                                                |

## Local Development

### Prerequisites

- Node.js (LTS)
- [pnpm](https://pnpm.io/)
- A running ZenML server (default: `http://localhost:8237`)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment config
cp .env.example .env

# Start dev server (default: http://localhost:5173)
pnpm dev
```

By default, the app sends requests to relative paths (for example `/api/v1/current-user`). In local development, the Vite dev server proxies `/api` requests to `VITE_BACKEND_URL`, so the frontend and backend appear on the same origin.

### Environment Variables

| Variable            | Default                 | Description                                                                                                                                      |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_BACKEND_URL`  | `http://localhost:8237` | ZenML server URL used by the Vite dev proxy                                                                                                      |
| `VITE_API_BASE_URL` | _(unset)_               | Optional API origin override (build-time). If set (for example `https://backend.test.com`), requests are sent to `<origin>/api/v1/...` directly. |

### Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Type-check and build for production
pnpm preview          # Preview the production build locally
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm test:unit        # Run unit tests (Vitest)
pnpm generate:types   # Generate OpenAPI types: pnpm generate:types -- <base-url>
```

### Pre-commit Hooks

The repo uses [Lefthook](https://github.com/evilmartians/lefthook) for pre-commit hooks that auto-fix ESLint issues and format staged files with Prettier.

## Architecture

### Project Structure

The frontend architecture is module-based under `src/modules/`.

```
src/
  modules/
    root/             Root Module bootstrap and app-global resources
    <module>/
      domain/          Types and actual API/request functions
      business-logic/  TanStack Query definitions and module logic
      feature/         Stateful containers and entrypoints
      util/            Module-scoped utilities
      ui/              Stateless presentational components
  routes/              File-based TanStack Router route definitions
  shared/
    api/domain/        Transport layer (apiClient, paths, errors)
    api/utils/         URL builders, error helpers
    router/utils/      Router-specific shared helpers
    ui/                Reusable UI primitives (Base UI-based)
    utils/             Shared utilities (styles, page titles)
  assets/              Icons, images (importable as React components via SVGR)
```

### Module Layers

- `domain/` contains module-owned types and the actual request functions that talk to the backend.
- `business-logic/` contains TanStack Query definitions and other module-specific logic.
- `feature/` contains stateful containers, orchestration, and module entrypoints.
- `util/` contains small module-scoped helpers.
- `ui/` contains stateless, dumb UI components.

### Generated Files

These files are auto-generated and should not be hand-edited:

- `src/routeTree.gen.ts` — generated by TanStack Router plugin from `src/routes/`
- `src/shared/api/types.ts` — generated by `pnpm generate:types` from the ZenML OpenAPI spec

Both are excluded from ESLint.

### App Boot Sequence

1. `src/main.tsx` creates the router with the generated route tree and injects a shared `queryClient`
2. Root route (`__root.tsx`) fetches server info — if the server is inactive, redirects to `/activate-server`
3. Private route (`_private.tsx`) ensures the current user is loaded before rendering children
4. If any query returns a 401, a global `QueryCache` error handler redirects to `/login`

### Data Fetching

- **Request functions** live in `domain/` and handle transport and response parsing.
- **Query keys and query collections** live in `business-logic/` and are built with `queryOptions(...)` or `infiniteQueryOptions(...)`.
- **Read APIs** should prefer grouped exports such as `deviceQueryKeys` and `deviceQueries` instead of standalone exported fetcher-query helpers.
- **Route loaders** call `context.queryClient.ensureQueryData(...)` to preload data
- **Mutations** are exposed from `business-logic/` as `mutationOptions(...)` factories, while their underlying request functions stay in `domain/`
- **Components** call `useMutation(...)` directly with mutation options
- Global 401 handling lives in the `QueryCache` error callback (`query-client.ts`)

### Authentication

- `apiClient` sends all requests with `credentials: "include"` (cookie auth)
- By default requests are relative (`/api/v1/...`); optionally set `VITE_API_BASE_URL` to target a full backend origin
- Vite proxies `/api` to `VITE_BACKEND_URL` in development
- Login uses `application/x-www-form-urlencoded` content type (exception to the default JSON headers)

## CI

GitHub Actions (`.github/workflows/build-validation.yml`) runs on pushes to `main` and `develop`, on all PRs, and by manual dispatch:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm build`
4. `pnpm test:unit`
5. `zizmor` audit for GitHub Actions workflow hardening

## Contributing

See [AGENTS.md](./AGENTS.md) for the full coding conventions, naming rules, data fetching patterns, and architectural guidance used by coding agents and contributors.
