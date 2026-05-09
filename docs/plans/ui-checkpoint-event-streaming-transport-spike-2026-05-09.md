# Live Events Transport and Identity Spike

Date: 2026-05-09

Scope: Work Item 1 from [`ui-checkpoint-event-streaming-2026-05-09.md`](./ui-checkpoint-event-streaming-2026-05-09.md). This is only the transport/auth/identity phase gate. It does not implement the Live events panel, hook, parser, or UI.

## Summary

**Browser fetch feasibility: YELLOW.** The frontend can use browser `fetch` + `ReadableStream` for the SSE endpoint, but local-to-staging auth is only realistic if the local UI calls the staging server directly with `VITE_API_BASE_URL` and the staging server allows credentialed CORS from the local dev origin.

The current Vite proxy is good for local servers. It is not enough, by itself, for staging cloud cookie auth because the browser talks to `localhost`, while the staging auth cookie belongs to the staging/cloud domain.

Concretely:

- Use `fetch`, not `EventSource`, because the app needs custom headers such as `Source-Context`, `X-CSRF-Token`, and reconnect `Last-Event-ID`.
- For staging smoke tests, prefer direct cross-origin browser requests:
  - `VITE_API_BASE_URL=https://<staging-server-origin>`
  - `VITE_BACKEND_URL` can remain local/proxy-only, but the stream fetch should resolve through `VITE_API_BASE_URL` when set.
- Staging must allow credentialed CORS from the dev origin, at minimum:
  - `http://localhost:5173`
  - probably also `http://127.0.0.1:5173` if developers use that URL.
- If staging CORS does not allow those origins, this is a backend/deployment prerequisite, not a UI-panel problem.

## Files inspected

UI transport/auth:

- `vite.config.ts:15` / `vite.config.ts:23` — Vite proxies `/api` to `VITE_BACKEND_URL`.
- `src/shared/api/domain/api-client.ts:8` — default headers include `Content-Type: application/json` and `Source-Context: kitaru-ui`.
- `src/shared/api/domain/api-client.ts:14` — `openapi-fetch` uses `credentials: "include"`.
- `src/shared/api/domain/api-client.ts:21` — CSRF middleware copies the local readable CSRF token into `X-CSRF-Token`.
- `src/shared/api/utils/csrf-token-cookie.ts:5` — the CSRF token is stored in a UI-readable cookie named `kitaru.cookie.csrf-token`.
- `src/modules/session/domain/login-user.ts:16` — login posts through `apiClient.POST("/api/v1/login")` and stores `csrf_token` from the login response.
- `.env.example:2` — default proxy target is `VITE_BACKEND_URL=http://localhost:8237`.
- `.env.local:2` — current checkout points the proxy at `http://127.0.0.1:8383`.

Backend SSE/auth:

- `../zenml/src/zenml/zen_server/routers/runs_endpoints.py:782` — `GET /api/v1/runs/{pipeline_run_id}/events/stream` returns `StreamingResponse` with `text/event-stream`.
- `../zenml/src/zenml/zen_server/routers/runs_endpoints.py:794` — route accepts `Last-Event-ID` as a request header.
- `../zenml/src/zenml/zen_server/routers/runs_endpoints.py:712` — if streaming is not configured, the route returns `501` with `Live event streaming is not enabled on this server.`
- `../zenml/src/zenml/zen_server/routers/runs_endpoints.py:728` — stream responses disable buffering with `Cache-Control: no-cache` and `X-Accel-Buffering: no`.
- `../zenml/src/zenml/zen_server/routers/runs_endpoints.py:866` / `:870` / `:920` — special frames are `gap`, `error`, and `end`.
- `../zenml/src/zenml/zen_server/auth.py:1266` — the server reads CSRF from `X-CSRF-Token`.
- `../zenml/src/zenml/zen_server/auth.py:279` — JWTs with a session id require CSRF, regardless of HTTP method.
- `../zenml/src/zenml/zen_server/auth.py:1074` — cross-site login responses generate a CSRF token and bind it to the auth session.
- `../zenml/src/zenml/zen_server/auth.py:1092` — the auth token is set as an HTTP-only cookie.
- `../zenml/src/zenml/zen_server/middleware.py:411` — CORS allows credentials and all headers/methods, but only for configured origins.
- `../zenml/src/zenml/config/server_config.py:692` — cloud/pro config adds dashboard/API/server URLs to allowed CORS origins; localhost is not guaranteed.

Identity:

- `src/modules/checkpoints/domain/checkpoint.ts:88` — `CheckpointEntry.id = node.id ?? node.node_id`.
- `../zenml/src/zenml/zen_stores/dag_generator.py:34` — fallback step DAG node id is `step/{name}`.
- `../zenml/src/zenml/zen_stores/sql_zen_store.py:6261` — when a step run exists, the DAG node `id` is the real `step_run.id`.
- `../zenml/src/zenml/streams/api.py:35` — ZenML stream events use `ctx.step_run.id` as top-level `step_run_id`.
- `../kitaru/src/kitaru/runtime.py:82` — Kitaru resolves the current checkpoint id from `step_context.step_run.id`.
- `../kitaru/src/kitaru/events.py:63` — Kitaru embeds that id as `payload.kitaru.checkpoint_id`.

## Transport finding

### What works in principle

The SSE route is a normal authenticated `GET` that returns a streaming response. Browser `fetch` can open this and expose `response.body` as a `ReadableStream`.

The required request shape for the UI implementation should be:

```ts
const response = await fetch(
	`${apiOrigin}/api/v1/runs/${executionId}/events/stream`,
	{
		method: "GET",
		credentials: "include",
		headers: {
			Accept: "text/event-stream",
			"Source-Context": "kitaru-ui",
			"X-CSRF-Token": csrfToken,
			...(lastEventId ? { "Last-Event-ID": lastEventId } : {}),
		},
		signal,
	}
);
```

For same-origin local-server development, `apiOrigin` can be empty and the request can go to `/api/v1/...` through Vite.

For staging cloud development, `apiOrigin` should come from `VITE_API_BASE_URL`.

### Why the existing Vite proxy is not enough for staging cloud cookies

The current proxy makes this browser request:

```text
Browser -> http://localhost:5173/api/v1/...
Vite    -> https://<staging-server-origin>/api/v1/...
```

That is fine for forwarding bytes, but not fine for existing cloud cookies:

1. A browser cookie for `.zenml.io` is only sent when the request URL is on that domain.
2. With the current proxy, the browser request URL is `localhost`, so the browser does not attach the staging cloud cookie.
3. If the staging server sends `Set-Cookie: Domain=.zenml.io` back through the localhost proxy, the browser sees it as a localhost response trying to set a `.zenml.io` cookie and should reject it.
4. The current `vite.config.ts` has no `cookieDomainRewrite` or custom auth bridge.

So the proxy path is realistic for local ZenML/Kitaru servers, but not for staging cloud cookie auth without additional proxy work.

### Recommended staging dev path

Use direct cross-origin requests instead:

```env
VITE_API_BASE_URL=https://<staging-server-origin>
# VITE_BACKEND_URL can stay pointed at a local server or be omitted for this spike.
```

Then start the UI from a stable localhost origin:

```bash
pnpm dev -- --host 127.0.0.1
# or pnpm dev and use http://localhost:5173 consistently
```

Then log in through the local UI against the staging backend. That matters because the backend sees `Origin: http://localhost:5173`, classifies the login as cross-site, returns a `csrf_token`, and sets a cross-site-capable auth cookie if CORS and cookie settings permit it.

After login, the browser should have:

- a staging-domain HTTP-only auth cookie, ideally `Secure; SameSite=None` for cross-site local dev;
- a local readable CSRF cookie named `kitaru.cookie.csrf-token` containing the login response `csrf_token`.

Subsequent stream fetches must include both:

- `credentials: "include"` for the HTTP-only auth cookie;
- `X-CSRF-Token: <value from kitaru.cookie.csrf-token>` for cross-site sessions.

### Manual browser smoke still required

I could not complete a real staging browser smoke in this checkout because no staging URL or browser auth session was available, and `.env.local` points to `http://127.0.0.1:8383`, which was not running.

Safe local command attempted:

```bash
curl -i -N --max-time 5 \
  -H 'Accept: text/event-stream' \
  -H 'Source-Context: kitaru-ui' \
  http://127.0.0.1:8383/api/v1/runs/00000000-0000-0000-0000-000000000000/events/stream
```

Result:

```text
curl: (7) Failed to connect to 127.0.0.1 port 8383: Couldn't connect to server
```

That only proves the currently configured local backend was unavailable. It does not prove anything about staging.

### Minimal manual staging smoke

Once `VITE_API_BASE_URL` points at staging and the local UI is logged in, run this in the browser console from the local UI page. It reads one chunk and aborts, so it should not leave a dangling connection.

```js
async function smokeStream(executionId) {
	const apiOrigin = import.meta.env?.VITE_API_BASE_URL || "";
	const csrf = document.cookie
		.split("; ")
		.find((row) => row.startsWith("kitaru.cookie.csrf-token="))
		?.split("=")[1];

	const controller = new AbortController();
	const response = await fetch(
		`${apiOrigin}/api/v1/runs/${executionId}/events/stream`,
		{
			method: "GET",
			credentials: "include",
			signal: controller.signal,
			headers: {
				Accept: "text/event-stream",
				"Source-Context": "kitaru-ui",
				...(csrf ? { "X-CSRF-Token": decodeURIComponent(csrf) } : {}),
			},
		}
	);

	console.log("status", response.status, response.statusText);
	console.log("content-type", response.headers.get("content-type"));

	if (!response.ok || !response.body) {
		console.log("body", await response.text());
		return;
	}

	const reader = response.body.getReader();
	const { value, done } = await reader.read();
	console.log("first chunk", done, new TextDecoder().decode(value));
	controller.abort();
}
```

Expected interpretations:

- `200` + `content-type: text/event-stream` + heartbeat/event bytes: transport works.
- CORS/preflight failure before a response: staging must allow the local dev origin.
- `401` with a CSRF/auth error: login/cookie/CSRF path is incomplete; make sure login happened through the same local UI origin and `X-CSRF-Token` is present.
- `404`: old server or route missing.
- `501`: server has the route but streaming is not enabled/configured.
- `503` + `Retry-After`: stream consumer cap or broker/publish problem; UI should surface retryable unavailable state.

## Identity finding

**Live event checkpoint ids are expected to match `CheckpointEntry.id` once the DAG has a real step run.**

The concrete chain is:

1. ZenML step context gives the live event producer `ctx.step_run.id`.
2. ZenML stream events expose that as top-level `step_run_id`.
3. Kitaru reads the same `step_context.step_run.id` as its active checkpoint id.
4. Kitaru event payloads embed it as `payload.kitaru.checkpoint_id`.
5. The UI DAG mapper uses `node.id` first.
6. The DAG generator sets a step node's `id` to `step_run.id` when a step run exists.

So for normal running/completed checkpoint events:

```text
payload.kitaru.checkpoint_id === event.step_run_id === CheckpointEntry.id
```

The main caveat is timing. Before ZenML has a concrete step run for a node, the DAG node has no `id`, and the UI falls back to `node.node_id`, which is shaped like `step/{name}`. A live event only exists once a step context exists, so the event should already carry the UUID. But the UI may still be holding a slightly stale DAG poll where the row id is still `step/{name}`.

### Alias mapping needed

Use this lookup order for live-event row clicks/highlighting:

1. Prefer `payload.kitaru.checkpoint_id` if present.
2. Else use top-level `step_run_id` if present.
3. If neither id is present, or if the current checkpoint list has not caught up, fall back to a name lookup using `payload.kitaru.checkpoint_name` or top-level `step_name`.
4. If the lookup only resolves to a fallback DAG id like `step/{name}`, do **not** pretend that id is a step-run UUID for detail fetches. Either:
   - use the event's UUID for `onSelectCheckpoint(...)` if available, and let the right panel fetch by UUID; or
   - disable the click until the next checkpoint DAG poll maps the row to a real UUID.

Recommended implementation detail for Work Item 3/6:

```ts
type CheckpointIdentityLookup = {
	byStepRunId: Map<string, CheckpointEntry>;
	byFallbackNodeId: Map<string, CheckpointEntry>; // e.g. step/draft_brief
	byName: Map<string, CheckpointEntry>;
};
```

When a live event arrives with a UUID that is not in `byStepRunId` but has a matching checkpoint name, invalidate/refetch the checkpoint DAG. That closes the short stale-poll window quickly.

## Recommendation for next implementation path

1. Add a tiny transport helper, not the panel, that builds the stream URL and headers from the same auth conventions as `apiClient`:
   - base URL: `env.VITE_API_BASE_URL || ""`;
   - `credentials: "include"`;
   - `Accept: text/event-stream`;
   - `Source-Context: kitaru-ui`;
   - `X-CSRF-Token` when `getCsrfToken()` returns a value;
   - `Last-Event-ID` only on reconnect.
2. Before building UI, manually run the browser smoke against staging with `VITE_API_BASE_URL=https://<staging-server-origin>`.
3. If staging CORS/auth works, continue to Work Item 2.
4. If staging CORS/auth fails, stop UI work and add one backend/deployment prerequisite:
   - allow `http://localhost:5173` and `http://127.0.0.1:5173` as credentialed CORS origins for staging; or
   - add a proper same-origin dev proxy that rewrites auth cookies safely and deliberately.
5. For identity mapping, treat `payload.kitaru.checkpoint_id` / `step_run_id` as the canonical detail-panel id, with name/fallback aliases only for bridging stale DAG rows.
