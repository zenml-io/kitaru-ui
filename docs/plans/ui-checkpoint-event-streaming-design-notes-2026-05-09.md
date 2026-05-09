# Live Events Panel — Design Notes

Sibling document to [`ui-checkpoint-event-streaming-2026-05-09.md`](./ui-checkpoint-event-streaming-2026-05-09.md). The plan covers what to build and how the data flows. This document covers what the panel looks like and how each visual state is supposed to feel.

The design was explored in a local playground at `design/playground/live-events-panel-2026-05-09.html` (gitignored). The decisions below are the output of that exploration.

## Summary

The panel is a quiet thing when the run is healthy and a clear thing when something is wrong. The chosen treatment:

- **Healthy live = no banner.** A pulsing connection chip in the header carries the "we are streaming" signal. Banners are reserved for problems.
- **Gap warning sits inline at the gap point**, not at the top of the panel. The panel becomes a record of _when_ something was missed, not just _that_ something was missed.
- **Progress rows use a thin trailing progress bar**, not an inline percent. The message leads; the bar gives a peripheral-vision sense of how full.
- **OpenAI text streams render as a distinct card** with a muted background and a border, sitting inside the panel between the surrounding event rows.
- **Panel bounded to 320px** with internal scroll. Tall enough for ~10–12 rows or a short OpenAI card with context; short enough that the checkpoint thread below stays visible.
- **Failure-state copy and chrome reuse `ExecutionLogsStaleBanner`** (amber background, `AlertTriangle` icon, ghost retry button) so the new panel inherits a vocabulary users already learned elsewhere in the app.

## Decisions

### 1. Healthy live state is quiet

**Decision.** When the stream is open and healthy, do not render a banner. The header carries a small pulsing chip (`live`) and an optional row count, and the rows speak for themselves.

**Why.** Banners are an attention budget. If a banner is on screen during the happy path, users go banner-blind and stop reading them when something actually goes wrong. The pulsing chip is a calmer signal — present but not demanding. The general rule: _live should be quiet, broken should be loud._

**Edge case.** While the stream is `connecting` (open request, no first frame yet) the panel shows an info-coloured empty state (`Opening live event stream…`) rather than a banner. Once the first frame arrives, the chip switches to `live` and the empty state is replaced by rows.

### 2. Gap warning is inline, at the position of the gap

**Decision.** When the server tells us events were dropped (a `gap` SSE frame), insert the gap banner _inside_ the row stream at the position where the gap happened, between the rows we know are reliable and the rows that arrived afterwards. Do not put it at the top of the panel.

**Why.** A gap has a position in time. A top-of-panel banner says "something is wrong" but doesn't tell you _where_ in the run things became unreliable. An inline banner says, in effect: events above this line are trustworthy; events below this line may be missing some siblings. That preserves the user's ability to trust rows that were never affected.

**Trade-off accepted.** Inline banners add visual clutter to the row stream. We accept that because the panel's job is to answer "what is happening right now?" — and "where in time did we lose visibility?" is exactly the kind of question a real-time panel should be honest about.

**Persistence.** Once an inline gap banner is rendered it stays in place permanently for the rest of the session. It is a record of "events here may be missing", not a transient indicator of "we are reconnecting right now". The reconnecting state is a separate top-of-panel banner with a retry button.

**Styling.** Same colour and icon language as `ExecutionLogsStaleBanner` (amber background, `AlertTriangle`, small text), full-width inside the row container, with a thin top and bottom border so it reads as a horizontal interruption rather than a row.

### 3. Progress rows use a thin trailing progress bar

**Decision.** A progress event renders as: `[ts] [checkpoint name] · [message]   [▮▮▮▮▮▯▯▯▯▯]`. The bar sits at the right, fixed width (around 80px), 4px tall, rounded.

**Why.** Three alternatives were on the table:

- _Inline percent number_ (`45%  draft_brief · Comparing claims`) is scannable but pulls the eye to the number first, when the message is what the user actually wants to read.
- _Background fill_ (a subtle gradient across the row visualising percent) feels alive and breathing, but it fights visually with the per-category left border and makes the row feel like a progress bar that swallowed text.
- _Percent chip_ is the busiest of the three.
- _Thin trailing bar_ keeps the message as the leading element, gives a peripheral sense of "how full", and stays out of the way of category coloring.

The trailing bar wins because the panel's primary job is to communicate _what is happening_, not _how far along_. Percent is secondary information and should sit visually secondary.

**Fallback.** If a progress event has no `percent`, render the row as message-only with no bar — do not show an empty bar, which reads as "0%" and is misleading.

### 4. OpenAI text streams are a distinct card

**Decision.** When an OpenAI streaming event arrives with text deltas, render the growing prose as a single card inside the panel: muted background, 1px border, 8px radius, with a small monospace meta line above the text identifying the stream (e.g. `OpenAI text · stream-92ab`). A blinking caret at the end of the text indicates the stream is still receiving deltas. Surrounding event rows render above and below the card normally.

**Why.** OpenAI prose is qualitatively different from a status row. A status row is a fact ("checkpoint started", "45% comparing claims"). The OpenAI text is a paragraph being written. Treating both the same way invites the user to either skim the prose like a row (and miss it) or read every row like prose (and burn out). The card honours the difference.

**Trade-off accepted.** A card visually breaks the row stream. That is correct, not a bug — the underlying activity _is_ qualitatively different at that moment.

**Multiple streams.** If multiple OpenAI streams are active at the same time, render multiple cards stacked in arrival order. We are not building tabs or a transcript viewer in v1.

**Lifecycle vs deltas.** `openai_agents.stream.start` is a normal lifecycle row above the card. `.error` and `.end` are normal lifecycle rows below the card. Only the text deltas live inside the card. The card itself does not animate in or out; it appears with the start row and stops growing when the end/error row appears.

### 5. Panel is bounded to 320px

**Decision.** The panel container has `max-height: 320px` with internal vertical scroll on the rows region. The header and any sticky banners sit outside the scroll region.

**Why.** The execution detail page already shows the timeline bar above and the checkpoint thread below the panel. Both need to stay visible; the panel cannot grow unbounded. 320px fits roughly 10–12 rows, or a short OpenAI card with a few rows of context above and below. Smaller felt cramped (5–6 rows is not enough to feel like a live stream); larger started to push the checkpoint thread off-screen on common laptop viewports.

**Edge case.** When an OpenAI card alone is taller than 320px, the panel scrolls — the card does not get its own internal max-height and "see more" affordance in v1. If this becomes uncomfortable in real use, revisit.

### 6. Failure-state chrome reuses `ExecutionLogsStaleBanner`

**Decision.** Every banner in the live events panel — gap, reconnecting, ended-error, ended-unsupported, ended-normal — uses the visual grammar already established by `src/modules/executions/ui/ExecutionLogsStaleBanner.tsx:11`:

- amber background (`bg-warning/10`) for warnings
- a small `lucide-react` icon at the start (`AlertTriangle` for warnings, `Info` for informational, `XCircle` for errors, `CheckCircle` for ended-normal)
- 12px text
- ghost-style retry/reconnect button on the right when an action is available

**Why.** Users have already learned in the logs tab that "amber strip with `AlertTriangle` and a retry button" means "the live data is stale, here is the way back". Reusing that vocabulary lets the new panel inherit familiarity for free. Visual consistency in failure states is a load-bearing form of trust — when the system breaks, the user wants a recognisable doorway out, not a new design language to decode.

**Don't reuse the data model.** Importantly, this is _visual_ reuse only. Do not reuse log domain types, log hooks, or log query keys for live events. The panel still owns its own domain (`src/modules/executions/domain/live-event.ts`), as the plan specifies.

## Implicit defaults

These were considered during exploration and kept at their defaults. Listing them so they are intentional, not accidental.

- **Category coloring is on (subtle left border).** A 2px left border in the per-category colour (`primary` for lifecycle, `info` for progress, `span-tool` for custom, `span-memory` for OpenAI lifecycle, `destructive` for failures). This is _all_ the category chrome — no badges, no chips, no separate columns. Cheap to scan, easy to ignore.
- **Raw kind tag is off by default.** `kitaru.checkpoint.progress` is noise for the user who only needs "this checkpoint is making progress". Keep raw kinds available in a row's expanded payload disclosure (and in dev tooling), not in the visible row by default.
- **Timestamps on.** A live panel without timestamps is just a list of facts; with timestamps it is a story. Mono font, 10.5px, leading column, `mm:ss` from execution start (not wall clock — wall clock is noisy and rarely the question being asked).
- **Checkpoint names are clickable.** Clicking a checkpoint name in a live event row should call the existing `onSelectCheckpoint(id)` path so the right panel opens that checkpoint, exactly as `CheckpointThread` does today. **Hard prerequisite:** the identity-mapping spike from Work Item 1 of the plan must have confirmed that `payload.kitaru.checkpoint_id` (or whatever the spike lands on) maps to `CheckpointEntry.id`. If it does not, the click handler must be wired to the alias lookup the spike defines. Do not ship clickable names that silently no-op — that feels broken in a way users blame the product for.
- **Connection chip in header.** Small pill with a coloured dot, mono label, `live` / `live · gap` / `connecting` / `reconnecting` / `ended` / `unavailable` / `error` / `off`. Pulses while connecting/live/reconnecting; static when ended.
- **Row count in header.** `12 events`, mono, muted. Useful for "did anything happen while I was looking somewhere else?". Hidden when the panel is empty.
- **"N new events" pill when scrolled up.** When the user has scrolled away from the bottom and new events arrive, show a small dark pill near the bottom of the row container (`↓ 3 new events`). Clicking it scrolls back to the bottom and resumes auto-follow. Do not auto-scroll over the user's position; let them opt back in.

## Connection state reference

What each `LiveEventsConnectionState` from the plan maps to visually.

| State                        | Header chip                                | Banner                                                                                                        | Empty state copy                                 |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `connecting`                 | `connecting` (info dot, pulsing)           | none                                                                                                          | `Opening live event stream…`                     |
| `live` (no gap)              | `live` (success dot, pulsing)              | none                                                                                                          | `Stream is open. No events yet.`                 |
| `live` (had gap)             | `live · gap` (success dot, pulsing)        | inline gap banner at the gap position                                                                         | (rows present)                                   |
| `reconnecting`               | `reconnecting` (warning dot, pulsing fast) | top-of-panel: `Live events paused — reconnecting…` + `Retry now` button                                       | (rows kept visible)                              |
| `ended` (run finished)       | `ended` (muted dot)                        | top-of-panel muted: `Run finished. Live events ended.`                                                        | `Run finished without emitting any live events.` |
| `ended` (server unsupported) | `unavailable` (muted dot)                  | top-of-panel muted: `Live events aren't available on this server. Logs and checkpoints are still up to date.` | same copy as banner                              |
| `ended` (stream error)       | `error` (destructive dot)                  | top-of-panel error: `Live event stream ended unexpectedly.` + `Reconnect` button                              | (rows kept visible)                              |
| `ended` (deliberate unmount) | `off` (muted dot)                          | none — silent                                                                                                 | (panel typically not visible)                    |

The deliberate-unmount case is intentionally indistinguishable from a panel that was never shown. A user who navigated away should not return to a "you disconnected" warning.

## Acceptance checklist

The implementer should be able to demonstrate, without changing code, all of these visual states:

- [ ] Healthy live stream with mixed lifecycle + progress + custom rows. No banner. Pulsing live chip. Row count visible.
- [ ] Healthy live stream with an active OpenAI text stream rendered as a distinct card between rows; caret blinking at the end of the prose; surrounding lifecycle rows above and below.
- [ ] Live stream with a gap: inline gap banner at the gap point, rows above the banner unaffected, rows below clearly post-gap. Header chip reads `live · gap`.
- [ ] Reconnecting: existing rows still visible, top-of-panel amber banner with `Retry now` button, header chip pulses faster.
- [ ] Ended (run finished): muted banner, ended chip, no retry button.
- [ ] Ended (server unsupported): muted banner with informational icon, panel otherwise empty, copy makes clear that logs/checkpoints are unaffected.
- [ ] Ended (stream error): destructive banner with `Reconnect` button, prior rows kept visible.
- [ ] Ended (deliberate unmount): no banner, no warning. Panel silently goes away.
- [ ] Connecting: info-coloured empty state, no rows yet, chip reads `connecting`.
- [ ] Failure path: a checkpoint with `started → progress (45%) → progress (60%) → failed` reads cleanly in sequence, with the failed row using destructive coloring.
- [ ] Panel bounded to 320px with internal scroll; checkpoint thread below remains visible.
- [ ] Auto-scroll follows latest event when at bottom; "N new events" pill appears when user has scrolled up; clicking the pill restores auto-scroll.
- [ ] Clicking a checkpoint name in a row opens that checkpoint in the right panel (or, if identity mapping is not yet wired, the click is disabled rather than silent).

## Open questions

1. **Inline banner vs row indentation.** The current design renders the inline gap banner full-width inside the panel rows region. An alternative is a thinner horizontal divider with inline text (`— some events may be missing —`) that reads as an annotation rather than a banner. Worth a second look once a real gap shows up in QA.
2. **Card vs first-row.** The OpenAI card currently sits _below_ the `stream.start` row. An alternative is for the card itself to absorb the start signal (no separate start row, the card's appearance _is_ the start). Probably defer until we see real traffic; the explicit start row is more debuggable.
3. **Multiple concurrent OpenAI streams.** Stacked cards are the v1 plan. If two streams are common in practice, a tabbed view or "active stream / completed streams" split may be needed. Out of scope for v1, but worth flagging in QA.
4. **OpenAI card max-height.** A long prose stream in a 320px panel will mostly fill the panel. Decide if/when the card itself needs an internal max-height with a "see more" affordance. Probably revisit only if it causes real discomfort.
5. **Specific failure copy.** `Live event stream ended unexpectedly.` is generic. Once we have real failure modes from QA (rate limit, broker disconnect, auth expired), specific copy per `reason` may be worth it.
6. **Feature-flag question from the plan.** Still open: should the v1 ship behind a feature flag for the first demo? If yes, the failure copy and the unsupported-server empty state can stay slightly less polished; if no, they need production-grade copy from the first PR. The visual treatment in this document is built around the "no flag" case to be safe.

## References

- Plan: [`ui-checkpoint-event-streaming-2026-05-09.md`](./ui-checkpoint-event-streaming-2026-05-09.md)
- Playground (gitignored): `design/playground/live-events-panel-2026-05-09.html`
- `src/modules/executions/ui/ExecutionLogsStaleBanner.tsx:11` — banner pattern being reused
- `src/modules/executions/ui/ExecutionDetails.tsx:52` — where the panel slots in
- `src/modules/executions/ui/traces/CheckpointThread.tsx:24` — the thread that sits below
- `src/modules/executions/ui/traces/ExecutionTimelineBar.tsx:34` — the bar that sits above
- `src/modules/executions/ui/traces/checkpoint-styles.ts` — category colour tokens reused for left borders
