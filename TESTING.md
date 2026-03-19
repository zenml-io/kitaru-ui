# Testing Kitaru UI Locally

This guide walks you through setting up the Kitaru UI against a local ZenML server so you can test features, log bugs, and give feedback.

## Prerequisites

- Node.js (LTS)
- [pnpm](https://pnpm.io/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (for installing the ZenML server)
- A Python virtual environment (recommended)

## 1. Install the ZenML Server

Install the ZenML server from the `develop` branch of the main ZenML repo. There is a helper script in this repository:

```bash
# From the kitaru-ui repo root
./scripts/install-kitaru-branch.sh develop
```

This runs `uv pip install` to install `zenml[dev,server,templates]` from the `develop` branch. Make sure you have a Python virtual environment active before running this.

> **Note:** Use the `develop` branch — the older `kitaru` branch is outdated.

## 2. Start the ZenML Server

```bash
zenml login --local
```

This starts the ZenML server on `http://localhost:8237` by default.

## 3. Start the Kitaru UI

```bash
# Install frontend dependencies (first time or after lockfile changes)
pnpm install

# Copy environment config (first time only)
cp .env.example .env

# Start the dev server
pnpm dev
```

The dev server starts at `http://localhost:5173` and proxies all `/api` requests to the ZenML backend at `VITE_BACKEND_URL` (defaults to `http://localhost:8237`).

If your ZenML server is running on a different port, update `VITE_BACKEND_URL` in your `.env` file.

## 4. Test the App

Open `http://localhost:5173` in your browser. You should see the Kitaru UI connected to your local ZenML server.

### What to look for

- **Bugs** — anything broken, unresponsive, or showing unexpected errors
- **UX issues** — confusing flows, missing feedback, unclear labels
- **Visual glitches** — layout problems, misaligned elements, theme issues

### Reporting issues

When reporting a bug, include:
- Steps to reproduce
- What you expected to happen
- What actually happened
- Browser and OS info
- Screenshots or screen recordings if possible

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ECONNREFUSED` on API calls | Make sure the ZenML server is running (`zenml login --local`) |
| 401 errors / redirect to login | Your session may have expired — log in again through the UI |
| Stale types or API mismatches | Regenerate types: `pnpm generate:types -- http://localhost:8237` |
| UI not reflecting code changes | Hard-refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`) |
