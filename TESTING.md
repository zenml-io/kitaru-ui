# Testing Kitaru UI Locally

This guide walks you through testing the Kitaru UI against a local Kitaru server. There are two approaches depending on what you need:

- **Option A: Dev server** (hot reload, fastest iteration) — run `pnpm dev` and proxy to a local Kitaru server
- **Option B: Docker** (production-like) — build the UI and bundle it into the Kitaru server image

## Prerequisites

- Node.js (LTS)
- [pnpm](https://pnpm.io/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (for installing Kitaru)
- A Python virtual environment (recommended)

## Option A: Dev Server (Hot Reload)

This is the fastest path for frontend development. The Vite dev server proxies `/api` requests to the Kitaru backend.

### 1. Install Kitaru with Server Extras

```bash
# Clone the kitaru repo (if you haven't already)
git clone https://github.com/zenml-io/kitaru.git
cd kitaru

# Install with server extras (pulls ZenML automatically)
uv sync --extra local
```

> **Testing against a specific Kitaru branch?** Just check out that branch
> before running `uv sync`:
> ```bash
> git checkout feat/my-branch
> uv sync --extra local
> ```

### 2. Start the Kitaru Server

```bash
uv run kitaru login --local
```

This starts the server on `http://localhost:8237` by default.

### 3. Start the Kitaru UI

```bash
# From the kitaru-ui repo root

# Install frontend dependencies (first time or after lockfile changes)
pnpm install

# Copy environment config (first time only)
cp .env.example .env

# Start the dev server
pnpm dev
```

The dev server starts at `http://localhost:5173` and proxies all `/api` requests to the Kitaru backend at `VITE_BACKEND_URL` (defaults to `http://localhost:8237`).

If your server is running on a different port, update `VITE_BACKEND_URL` in your `.env` file.

### 4. Open the App

Open `http://localhost:5173` in your browser. You should see the Kitaru UI connected to your local server.

## Option B: Docker (Production-like)

This tests the UI as it would be served in production — bundled into the Kitaru server image, served by the ZenML FastAPI server on the same port as the API.

### 1. Build the Kitaru UI

```bash
# From the kitaru-ui repo root
pnpm install
pnpm build
```

This creates a `dist/` directory with the production build.

### 2. Copy the Build Output to the Kitaru Repo

```bash
cp -r dist/ /path/to/kitaru/docker/kitaru-ui-dist/
```

### 3. Build and Run the Dev Server Image

```bash
# From the kitaru repo root
just server-dev-image
docker run -p 8080:8080 kitaru-server-dev
```

### 4. Open the App

Open `http://localhost:8080` in your browser. The UI and API are served on the same port, just like production.

## What to Look For

- **Bugs** — anything broken, unresponsive, or showing unexpected errors
- **UX issues** — confusing flows, missing feedback, unclear labels
- **Visual glitches** — layout problems, misaligned elements, theme issues

## Reporting Issues

When reporting a bug, include:
- Steps to reproduce
- What you expected to happen
- What actually happened
- Browser and OS info
- Screenshots or screen recordings if possible

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ECONNREFUSED` on API calls | Make sure the server is running (`uv run kitaru login --local` for Option A, or check `docker ps` for Option B) |
| 401 errors / redirect to login | Your session may have expired — log in again through the UI |
| Stale types or API mismatches | Regenerate types: `pnpm generate:types -- http://localhost:8237` |
| UI not reflecting code changes | Hard-refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`) |
| Docker build fails on missing `index.html` | Make sure you ran `pnpm build` and copied `dist/` to `docker/kitaru-ui-dist/` |
