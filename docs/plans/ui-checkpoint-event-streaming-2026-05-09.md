# UI Checkpoint Event Streaming: Plan

## Goal

Add a separate **Live events** panel to the `kitaru-ui` execution detail page so users can watch checkpoint work while a run is still active.

The panel should show checkpoint lifecycle/progress/custom events and OpenAI text deltas without confusing those best-effort events with durable logs. If the stream drops, reconnects with a gap, or may have missed events, the UI should say so clearly.

## User Experience

The execution page should get one new center-pane section:

```text
Timeline bar
Live events panel   <- new
Checkpoint thread
```

The panel answers “what is happening right now?”

- `draft_brief started`
- `45% Comparing the strongest claims`
- `Recommendation section is ready`
- OpenAI text appears as one growing text block, not hundreds of tiny token rows.
- If the stream disconnects: `Live events paused — some events may be missing.`

Durable logs and artifacts keep their current role. They are the records to inspect later. Live events are postcards from inside the running checkpoint.

## Background

- `ExecutionContainer` owns the execution detail page state, including the active `execution` / `logs` tab, selected checkpoint, checkpoint DAG, and right-side checkpoint panel (`src/modules/executions/feature/ExecutionContainer.tsx:160`).
- The execution tab renders `ExecutionTimelineBar` and `CheckpointThread` through `ExecutionDetails` (`src/modules/executions/ui/ExecutionDetails.tsx:52`).
- Logs are separate durable/polled records rendered through the logs tab and log containers (`src/modules/executions/feature/ExecutionLogsTabContainer.tsx:31`, `src/modules/executions/feature/ExecutionLogsPanelContainer.tsx:68`).
- Existing live-ish UI uses TanStack Query polling every 3 seconds while a run/checkpoint is active (`src/modules/checkpoints/business-logic/use-checkpoints.tsx:6`, `src/modules/executions/business-logic/use-execution-logs.ts:11`).
- Existing log UI already has useful stale-state language: when later polling fails after data exists, it keeps the data visible and shows a stale banner (`src/modules/executions/feature/ExecutionLogsPanelContainer.tsx:43`, `src/modules/executions/ui/ExecutionLogsStaleBanner.tsx:11`).
- `kitaru-ui` has no current `EventSource`, WebSocket, `ReadableStream`, or `text/event-stream` pattern.
- The app normally talks to the backend through generated `openapi-fetch` with cookie credentials and CSRF middleware (`src/shared/api/domain/api-client.ts:14`).
- ZenML exposes run events over SSE at `GET /api/v1/runs/{run_id}/events/stream`, with normal stream events plus special `gap`, `error`, and `end` frames (`../zenml/src/zenml/zen_server/routers/runs_endpoints.py:782`).
- Kitaru checkpoint event kinds are `kitaru.checkpoint.started`, `.progress`, `.completed`, and `.failed` (`../kitaru/src/kitaru/events.py:21`).
- Kitaru OpenAI Agents streaming event kinds are `openai_agents.stream.start`, `.event`, `.end`, and `.error`; `.event` payloads may include `text_delta` and `display` (`../kitaru/src/kitaru/adapters/openai_agents/_streaming.py:14`).

## Phase Gate: Validate Browser Streaming First

Spike note: [`ui-checkpoint-event-streaming-transport-spike-2026-05-09.md`](./ui-checkpoint-event-streaming-transport-spike-2026-05-09.md) records the Work Item 1 findings. Current result: **YELLOW**. Browser `fetch` is the right transport, and event checkpoint IDs should match `CheckpointEntry.id` once the DAG has a real step run, but staging still needs a manual credentialed-CORS browser smoke with `VITE_API_BASE_URL=https://<staging-server-origin>` before the UI branch proceeds.

This is the scheduling lever. Do this before building the panel.

Use a tiny spike to answer:

1. Can browser `fetch` open `/api/v1/runs/{executionId}/events/stream` against the deployed streaming server with the current cookie/CORS setup?
2. Does the GET stream route require the CSRF header, or are cookie credentials enough?
3. Does the endpoint return clear unsupported responses on old/non-streaming servers?
4. Do event checkpoint IDs match the IDs used by the existing checkpoint UI?

If browser `fetch` works, continue with the UI branch below.

If browser `fetch` does **not** work, stop UI implementation and add a backend prerequisite first: either a same-origin Kitaru UI proxy or a server-side CORS/auth adjustment. Do not build the panel around a mocked transport and hope the real stream works later.

## Event Source Contract

Use native `fetch` + `ReadableStream` parsing for v1. Do not use `EventSource`; it cannot set custom headers, and this app already has API header conventions.

Request shape:

```http
GET /api/v1/runs/{executionId}/events/stream
Accept: text/event-stream
Source-Context: kitaru-ui
Last-Event-ID: <last seen SSE id, on reconnect only>
```

Expected normal SSE frame:

```text
id: broker-event-123
event: kitaru.checkpoint.progress
data: {"pipeline_run_id":"...","step_run_id":"...","step_name":"draft_brief","kind":"kitaru.checkpoint.progress","stream_id":"kitaru.checkpoint:draft_brief:...","index":2,"ts":"2026-05-09T12:00:04Z","payload":{"message":"Comparing claims","data":{"percent":0.45},"kitaru":{"checkpoint_id":"...","checkpoint_name":"draft_brief"}}}
```

Special frames:

```text
event: gap
data: {"reason":"..."}

event: error
data: {"reason":"stream_failed"}

event: end
data: {}
```

Do not filter by `kinds` in v1. Known kinds get rich rendering; unknown/custom kinds fall back to a compact custom-event row.

Use `Last-Event-ID` only for reconnects inside the current browser session. Do not present it as durable historical replay after page reload.

## Approach

### 1. Place the panel in the execution tab

Recommended integration:

- `ExecutionTabContainer` creates `ExecutionLiveEventsPanelContainer`.
- `ExecutionDetails` accepts a `liveEventsPanel?: React.ReactNode` prop.
- `ExecutionDetails` renders it between `ExecutionTimelineBar` and `CheckpointThread`.

Why:

- The execution tab is where users already watch run progress.
- The logs tab should stay about durable log records.
- The right panel is checkpoint-specific, while v1 needs execution-wide live events, including OpenAI streams.

### 2. Keep live events separate from logs

Create execution-domain live-event files, not log-domain files:

- `src/modules/executions/domain/live-event.ts`
- `src/modules/executions/domain/sse-parser.ts`
- `src/modules/executions/domain/fetch-execution-event-stream.ts`
- `src/modules/executions/business-logic/use-execution-live-events.ts`

Suggested event model:

```ts
type ExecutionLiveEvent = {
	transportId?: string;
	executionId: string;
	kind: string;
	timestamp?: Date;
	streamId?: string;
	index?: number;
	checkpointId?: string;
	checkpointName?: string;
	payload: Record<string, unknown>;
	category:
		| "checkpoint_lifecycle"
		| "checkpoint_progress"
		| "openai_text_delta"
		| "openai_stream_lifecycle"
		| "custom"
		| "unknown";
};
```

Dedupe precedence:

1. SSE `id` / `transportId`.
2. `${kind}:${streamId}:${index}`.
3. Otherwise append by arrival order.

Do not globally reorder the panel by timestamp. Append in arrival order so the UI reflects what actually reached the browser.

### 3. Be explicit about checkpoint identity mapping

Existing checkpoint rows use `CheckpointEntry.id`, which is mapped from `node.id ?? node.node_id` (`src/modules/checkpoints/domain/checkpoint.ts:75`, `src/modules/checkpoints/domain/checkpoint.ts:85`). `CheckpointThread` keys and highlights rows by `entry.data.id` (`src/modules/executions/ui/traces/CheckpointThread.tsx:24`).

The transport spike must confirm whether incoming `payload.kitaru.checkpoint_id` or ZenML `step_run_id` matches `CheckpointEntry.id`.

If it matches:

- live event rows with `checkpointId` can call existing `onSelectCheckpoint(checkpointId)`.

If it does not match:

- extend the checkpoint DAG mapping to keep alias IDs from the raw node;
- build a lookup from event checkpoint identity to UI checkpoint row ID before enabling row clicks.

Do not leave this to integration testing; silent no-op row clicks would make the panel feel broken.

### 4. Use a small connection state model

Keep v1 small:

```ts
type LiveEventsConnectionState =
	| { status: "connecting" }
	| { status: "live"; hadGap: boolean }
	| { status: "reconnecting"; reason: string; hadGap: boolean }
	| { status: "ended"; reason?: string; canRetry: boolean; hadGap: boolean };
```

Interpretation:

- `connecting`: stream not open yet.
- `live`: stream is open; if `hadGap`, keep a “some events may be missing” warning visible.
- `reconnecting`: network closed while execution is active; keep existing rows and retry with `Last-Event-ID`.
- `ended`: stream ended normally, disconnected permanently, or is unavailable. Use `reason` + `canRetry` to choose copy and retry UI.

A deliberate unmount/abort should stop quietly and not show disconnected warning.

### 5. Render by meaning, not raw JSON

The first renderer should cover these cases:

- checkpoint lifecycle rows: started/completed/failed;
- checkpoint progress rows: message plus optional percent;
- custom event rows: kind + message, with details behind a disclosure;
- OpenAI stream lifecycle rows: start/end/error;
- OpenAI text deltas: group by `streamId` and render one growing text block per stream.

OpenAI deltas should not become one row per token. The useful UI is a paragraph being written, not a rainfall of token fragments.

## Work Items

1. **Transport and identity spike**
   - Open the SSE endpoint from the browser using `fetch`.
   - Confirm cookies/CORS/CSRF behavior.
   - Confirm unsupported-server response shape.
   - Capture one normal checkpoint progress frame, one OpenAI text-delta frame, and one special frame if possible.
   - Confirm event checkpoint IDs match, or do not match, `CheckpointEntry.id`.
   - Exit criteria: either “direct browser fetch works; continue UI work” or “backend proxy/auth work required; stop UI branch here.”

2. **SSE parser and event mapper**
   - Parse SSE `id`, `event`, and multi-line `data` frames.
   - Ignore heartbeat comments.
   - Map normal ZenML stream events into `ExecutionLiveEvent`.
   - Map `gap`, `error`, and `end` special frames into connection actions.
   - Classify known Kitaru/OpenAI kinds, with a `custom` fallback.

3. **Live-event hook/reducer**
   - Implement `useExecutionLiveEvents(executionId, executionStatus, checkpoints)`.
   - Source `executionStatus` from the same checkpoint DAG status already used by `ExecutionContainer` / `ExecutionTabContainer`.
   - Open streams only for active executions unless the transport spike proves useful recent history is available.
   - Handle reconnect, dedupe, `Last-Event-ID`, gap tracking, unmount abort, and unsupported endpoints.
   - Keep state in memory; do not put live events into TanStack Query as if they were durable cached data.

4. **OpenAI text aggregation**
   - Group `openai_agents.stream.event` text deltas by `streamId`.
   - Sort within a stream by `index` when present.
   - Ignore duplicate chunks.
   - Mark streams failed/ended from `.error` and `.end` events.

5. **Panel UI**
   - Build panel shell, status indicator, empty state, stale/disconnected banner, event rows, custom-event disclosure, and OpenAI text block.
   - Keep the panel height bounded so the checkpoint thread remains visible.
   - Reuse existing warning/banner language where it fits; do not reuse log data models.

6. **Execution-tab integration**
   - Add the panel container to `ExecutionTabContainer`.
   - Add a `liveEventsPanel` slot to `ExecutionDetails`.
   - Wire checkpoint-associated event rows to the existing checkpoint selection path, using the identity lookup from Work Item 1/3.
   - Leave the logs tab unchanged.

7. **Tests and QA**
   - Unit-test SSE parsing, event classification, dedupe, gap/error/end behavior, and checkpoint identity lookup.
   - Unit-test OpenAI text aggregation, including duplicate and out-of-order indexed chunks.
   - Component-test connecting/live/empty/stale/unavailable/ended panel states.
   - Mock an active stream with lifecycle + progress + OpenAI text deltas.
   - Manually QA against a streaming-enabled server with an active checkpoint progress run and an active OpenAI streaming run.

## Non-goals

- Do not replace the logs tab.
- Do not persist live events as durable records.
- Do not guarantee historical replay after page reload.
- Do not build a full transcript viewer in v1.
- Do not add right-panel checkpoint tabs in v1.
- Do not build UI polish for a transport that has not passed the browser spike.

## Open Question

Should this ship behind a feature flag for the first branch/demo? If yes, the implementation can keep copy and polish lighter while transport and event semantics settle. If no, the stale/unavailable states need production-quality UX from the first PR.

## References

- `src/modules/executions/feature/ExecutionContainer.tsx:160`
- `src/modules/executions/feature/ExecutionTabContainer.tsx:85`
- `src/modules/executions/ui/ExecutionDetails.tsx:52`
- `src/modules/executions/ui/traces/CheckpointThread.tsx:24`
- `src/modules/checkpoints/domain/checkpoint.ts:75`
- `src/modules/checkpoints/domain/checkpoint.ts:85`
- `src/modules/executions/feature/ExecutionLogsPanelContainer.tsx:43`
- `src/modules/executions/ui/ExecutionLogsStaleBanner.tsx:11`
- `src/modules/checkpoints/business-logic/use-checkpoints.tsx:6`
- `src/modules/executions/business-logic/use-execution-logs.ts:11`
- `src/shared/api/domain/api-client.ts:14`
- `../zenml/src/zenml/models/v2/core/stream_event.py:26`
- `../zenml/src/zenml/zen_server/routers/runs_endpoints.py:782`
- `../kitaru/src/kitaru/events.py:21`
- `../kitaru/src/kitaru/adapters/openai_agents/_streaming.py:14`
