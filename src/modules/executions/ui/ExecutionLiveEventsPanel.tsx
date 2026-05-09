import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/styles";
import {
	AlertTriangle,
	CheckCircle,
	ChevronDown,
	Info,
	XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	aggregateOpenAiTextStreams,
	getOpenAiStreamId,
	type OpenAiTextStream,
} from "../domain/openai-text-aggregation";
import type {
	CheckpointSelectionResolution,
	ExecutionLiveEvent,
} from "../domain/live-event";
import type {
	ExecutionLiveEventsRow,
	LiveEventsConnectionState,
} from "../domain/live-event-state";

type ExecutionLiveEventsPanelProps = {
	connection: LiveEventsConnectionState;
	rows: ExecutionLiveEventsRow[];
	executionStartTime?: Date;
	onRetry: () => void;
	resolveCheckpointSelection: (
		event: ExecutionLiveEvent
	) => CheckpointSelectionResolution;
	onSelectCheckpoint: (checkpointId: string) => void;
};

type DisplayItem =
	| { type: "row"; row: ExecutionLiveEventsRow }
	| { type: "openai-card"; stream: OpenAiTextStream };

export function ExecutionLiveEventsPanel({
	connection,
	rows,
	executionStartTime,
	onRetry,
	resolveCheckpointSelection,
	onSelectCheckpoint,
}: ExecutionLiveEventsPanelProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const previousRowCountRef = useRef(rows.length);
	const [isFollowing, setIsFollowing] = useState(true);
	const [newEventCount, setNewEventCount] = useState(0);
	const eventRows = useMemo(
		() => rows.filter((row) => row.type === "event"),
		[rows]
	);
	const events = useMemo(() => eventRows.map((row) => row.event), [eventRows]);
	const openAiStreams = useMemo(
		() => aggregateOpenAiTextStreams(events),
		[events]
	);
	const displayItems = useMemo(
		() => buildDisplayItems(rows, openAiStreams),
		[rows, openAiStreams]
	);

	useEffect(() => {
		const previousCount = previousRowCountRef.current;
		const addedCount = Math.max(0, rows.length - previousCount);
		previousRowCountRef.current = rows.length;

		if (isFollowing) {
			window.requestAnimationFrame(() => {
				const scrollNode = scrollRef.current;
				if (scrollNode) {
					scrollNode.scrollTop = scrollNode.scrollHeight;
				}
				setNewEventCount(0);
			});
		} else if (addedCount > 0) {
			window.requestAnimationFrame(() => {
				setNewEventCount((count) => count + addedCount);
			});
		}
	}, [rows.length, isFollowing]);

	function handleScroll() {
		const scrollNode = scrollRef.current;
		if (!scrollNode) {
			return;
		}
		const distanceFromBottom =
			scrollNode.scrollHeight - scrollNode.scrollTop - scrollNode.clientHeight;
		const atBottom = distanceFromBottom < 24;
		setIsFollowing(atBottom);
		if (atBottom) {
			setNewEventCount(0);
		}
	}

	function resumeFollowing() {
		const scrollNode = scrollRef.current;
		if (!scrollNode) {
			return;
		}
		scrollNode.scrollTop = scrollNode.scrollHeight;
		setIsFollowing(true);
		setNewEventCount(0);
	}

	return (
		<section className="border-border bg-background shrink-0 border-b">
			<div className="border-border flex items-center gap-2 border-b px-4 py-2">
				<div className="flex min-w-0 flex-1 items-center gap-2">
					<h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
						Live events
					</h2>
					<LiveEventsConnectionChip connection={connection} />
				</div>
				{events.length > 0 ? (
					<span className="text-muted-foreground font-mono text-[11px]">
						{events.length} {events.length === 1 ? "event" : "events"}
					</span>
				) : null}
			</div>

			<TopConnectionBanner connection={connection} onRetry={onRetry} />

			<div className="relative">
				<div
					ref={scrollRef}
					onScroll={handleScroll}
					className="max-h-[320px] overflow-y-auto px-4 py-3"
				>
					{displayItems.length === 0 ? (
						<LiveEventsEmptyState connection={connection} />
					) : (
						<div className="space-y-2">
							{displayItems.map((item) =>
								item.type === "openai-card" ? (
									<OpenAiTextCard
										key={`openai:${item.stream.streamId}`}
										stream={item.stream}
									/>
								) : (
									<LiveEventsPanelRow
										key={item.row.id}
										row={item.row}
										executionStartTime={executionStartTime}
										resolveCheckpointSelection={resolveCheckpointSelection}
										onSelectCheckpoint={onSelectCheckpoint}
									/>
								)
							)}
						</div>
					)}
				</div>
				{newEventCount > 0 ? (
					<Button
						type="button"
						size="xs"
						onClick={resumeFollowing}
						className="bg-foreground text-background hover:bg-foreground/90 absolute bottom-3 left-1/2 h-6 -translate-x-1/2 rounded-full px-3 text-xs"
					>
						<ChevronDown className="size-3" />
						{newEventCount} new {newEventCount === 1 ? "event" : "events"}
					</Button>
				) : null}
			</div>
		</section>
	);
}

function buildDisplayItems(
	rows: ExecutionLiveEventsRow[],
	openAiStreams: OpenAiTextStream[]
): DisplayItem[] {
	const streamsById = new Map(
		openAiStreams.map((stream) => [stream.streamId, stream])
	);
	const renderedStreamIds = new Set<string>();
	const items: DisplayItem[] = [];

	for (const row of rows) {
		if (row.type === "gap") {
			items.push({ type: "row", row });
			continue;
		}

		const streamId = row.event.kind.startsWith("openai_agents.stream.")
			? getOpenAiStreamId(row.event)
			: row.event.streamId;
		const stream = streamId ? streamsById.get(streamId) : undefined;
		const isOpenAiDelta = row.event.category === "openai_text_delta";

		if (!isOpenAiDelta) {
			items.push({ type: "row", row });
		}

		if (stream && !renderedStreamIds.has(stream.streamId)) {
			if (row.event.kind === "openai_agents.stream.start" || isOpenAiDelta) {
				items.push({ type: "openai-card", stream });
				renderedStreamIds.add(stream.streamId);
			}
		}
	}

	return items;
}

function LiveEventsConnectionChip({
	connection,
}: {
	connection: LiveEventsConnectionState;
}) {
	const chip = getConnectionChip(connection);
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase",
				chip.className
			)}
		>
			<span
				className={cn(
					"size-1.5 rounded-full",
					chip.dotClassName,
					chip.pulse && "animate-pulse"
				)}
			/>
			{chip.label}
		</span>
	);
}

function TopConnectionBanner({
	connection,
	onRetry,
}: {
	connection: LiveEventsConnectionState;
	onRetry: () => void;
}) {
	if (connection.status === "reconnecting") {
		return (
			<LiveEventsBanner
				tone="warning"
				actionLabel="Retry now"
				onAction={onRetry}
			>
				Live events paused — reconnecting…
			</LiveEventsBanner>
		);
	}
	if (connection.status === "live" && connection.hadDisconnect) {
		return (
			<LiveEventsBanner tone="warning">
				Connection was interrupted. Some live events may be missing.
			</LiveEventsBanner>
		);
	}
	if (connection.status !== "ended") {
		return null;
	}
	if (connection.reason === "unavailable") {
		return (
			<LiveEventsBanner
				tone="info"
				actionLabel={connection.canRetry ? "Retry" : undefined}
				onAction={connection.canRetry ? onRetry : undefined}
			>
				Live events aren't available on this server. Logs and checkpoints are
				still up to date.
			</LiveEventsBanner>
		);
	}
	if (connection.reason === "stream_error") {
		return (
			<LiveEventsBanner tone="error" actionLabel="Reconnect" onAction={onRetry}>
				Live event stream ended unexpectedly.
			</LiveEventsBanner>
		);
	}
	if (connection.reason === "disconnected") {
		return (
			<LiveEventsBanner tone="error" actionLabel="Reconnect" onAction={onRetry}>
				Live event stream could not reconnect. Some events may be missing.
			</LiveEventsBanner>
		);
	}
	if (connection.reason === "run_finished") {
		return (
			<LiveEventsBanner tone="ended">
				Run finished. Live events ended.
			</LiveEventsBanner>
		);
	}
	return null;
}

function LiveEventsBanner({
	tone,
	actionLabel,
	onAction,
	children,
}: {
	tone: "warning" | "error" | "info" | "ended";
	actionLabel?: string;
	onAction?: () => void;
	children: React.ReactNode;
}) {
	const Icon =
		tone === "warning"
			? AlertTriangle
			: tone === "error"
				? XCircle
				: tone === "ended"
					? CheckCircle
					: Info;

	return (
		<div
			role="status"
			className={cn(
				"border-border flex shrink-0 items-center gap-2 border-b px-3 py-1.5 text-xs",
				tone === "warning" && "bg-warning/10 text-warning",
				tone === "error" && "bg-destructive/10 text-destructive",
				tone === "info" && "bg-muted text-muted-foreground",
				tone === "ended" && "bg-muted text-muted-foreground"
			)}
		>
			<Icon className="size-3.5 shrink-0" />
			<span className="flex-1">{children}</span>
			{actionLabel && onAction ? (
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={onAction}
					className="h-6 px-2 text-xs"
				>
					{actionLabel}
				</Button>
			) : null}
		</div>
	);
}

function LiveEventsEmptyState({
	connection,
}: {
	connection: LiveEventsConnectionState;
}) {
	return (
		<div className="border-border bg-muted/40 text-muted-foreground rounded-lg border border-dashed px-3 py-4 text-center text-xs">
			{getEmptyStateCopy(connection)}
		</div>
	);
}

function LiveEventsPanelRow({
	row,
	executionStartTime,
	resolveCheckpointSelection,
	onSelectCheckpoint,
}: {
	row: ExecutionLiveEventsRow;
	executionStartTime?: Date;
	resolveCheckpointSelection: (
		event: ExecutionLiveEvent
	) => CheckpointSelectionResolution;
	onSelectCheckpoint: (checkpointId: string) => void;
}) {
	if (row.type === "gap") {
		return <LiveEventsGapRow reason={row.reason} />;
	}

	const event = row.event;
	return (
		<div
			className={cn(
				"border-border bg-card rounded-md border py-2 pr-3 pl-2 text-xs shadow-xs",
				getRowBorderClass(event)
			)}
		>
			<div className="flex items-start gap-2">
				<span className="text-muted-foreground mt-0.5 w-10 shrink-0 font-mono text-[10.5px]">
					{formatEventTimestamp(event, executionStartTime)}
				</span>
				<div className="min-w-0 flex-1">
					<div className="flex min-w-0 items-center gap-1.5">
						<CheckpointName
							event={event}
							resolveCheckpointSelection={resolveCheckpointSelection}
							onSelectCheckpoint={onSelectCheckpoint}
						/>
						<span className="text-foreground min-w-0 truncate">
							{getEventMessage(event)}
						</span>
					</div>
					{event.category === "custom" ? (
						<EventPayloadDetails event={event} />
					) : null}
				</div>
				{event.category === "checkpoint_progress" &&
				event.progressRatio !== undefined ? (
					<ProgressBar ratio={event.progressRatio} />
				) : null}
			</div>
		</div>
	);
}

function CheckpointName({
	event,
	resolveCheckpointSelection,
	onSelectCheckpoint,
}: {
	event: ExecutionLiveEvent;
	resolveCheckpointSelection: (
		event: ExecutionLiveEvent
	) => CheckpointSelectionResolution;
	onSelectCheckpoint: (checkpointId: string) => void;
}) {
	if (!event.checkpointName) {
		return null;
	}

	const resolution = resolveCheckpointSelection(event);
	const checkpointId = resolution.checkpointId;
	if (checkpointId) {
		return (
			<button
				type="button"
				onClick={() => onSelectCheckpoint(checkpointId)}
				className="text-primary shrink-0 font-mono text-[11px] font-medium hover:underline"
			>
				{event.checkpointName}
			</button>
		);
	}

	return (
		<span
			className="text-muted-foreground shrink-0 cursor-not-allowed border-b border-dotted font-mono text-[11px]"
			title={
				resolution.reason ??
				"Checkpoint details are not available for this event."
			}
		>
			{event.checkpointName}
		</span>
	);
}

function LiveEventsGapRow({ reason }: { reason?: string }) {
	return (
		<div className="border-warning/30 bg-warning/10 text-warning flex items-center gap-2 border-y px-3 py-2 text-xs">
			<AlertTriangle className="size-3.5 shrink-0" />
			<span className="flex-1">
				Some live events may be missing here{reason ? ` — ${reason}` : ""}.
			</span>
		</div>
	);
}

function OpenAiTextCard({ stream }: { stream: OpenAiTextStream }) {
	return (
		<div className="border-border bg-muted/50 rounded-lg border p-3 text-xs">
			<div className="text-muted-foreground mb-2 flex items-center gap-2 font-mono text-[10.5px]">
				<span>OpenAI text · {stream.display ?? stream.streamId}</span>
				<span className="capitalize">{stream.status}</span>
			</div>
			<div className="text-foreground leading-relaxed whitespace-pre-wrap">
				{stream.text || (
					<span className="text-muted-foreground">
						Waiting for text deltas…
					</span>
				)}
				{stream.status === "streaming" ? (
					<span className="bg-primary ml-0.5 inline-block h-4 w-1 animate-pulse align-[-2px]" />
				) : null}
			</div>
		</div>
	);
}

function EventPayloadDetails({ event }: { event: ExecutionLiveEvent }) {
	return (
		<details className="mt-1 text-[11px]">
			<summary className="text-muted-foreground cursor-pointer">
				Details
			</summary>
			<pre className="bg-muted text-muted-foreground mt-1 max-h-28 overflow-auto rounded p-2 font-mono text-[10px] whitespace-pre-wrap">
				{JSON.stringify({ kind: event.kind, payload: event.payload }, null, 2)}
			</pre>
		</details>
	);
}

function ProgressBar({ ratio }: { ratio: number }) {
	return (
		<div className="bg-muted mt-1.5 h-1 w-20 shrink-0 overflow-hidden rounded-full">
			<div
				className="bg-info h-full rounded-full"
				style={{ width: `${Math.round(ratio * 100)}%` }}
			/>
		</div>
	);
}

function getConnectionChip(connection: LiveEventsConnectionState): {
	label: string;
	className: string;
	dotClassName: string;
	pulse: boolean;
} {
	if (connection.status === "connecting") {
		return {
			label: "connecting",
			className: "border-info/30 bg-info/10 text-info",
			dotClassName: "bg-info",
			pulse: true,
		};
	}
	if (connection.status === "live") {
		return {
			label: connection.hadGap ? "live · gap" : "live",
			className: "border-success/30 bg-success/10 text-success",
			dotClassName: "bg-success",
			pulse: true,
		};
	}
	if (connection.status === "reconnecting") {
		return {
			label: "reconnecting",
			className: "border-warning/30 bg-warning/10 text-warning",
			dotClassName: "bg-warning",
			pulse: true,
		};
	}
	if (connection.reason === "unavailable") {
		return {
			label: "unavailable",
			className: "border-border bg-muted text-muted-foreground",
			dotClassName: "bg-muted-foreground",
			pulse: false,
		};
	}
	if (connection.reason === "stream_error") {
		return {
			label: "error",
			className: "border-destructive/30 bg-destructive/10 text-destructive",
			dotClassName: "bg-destructive",
			pulse: false,
		};
	}
	return {
		label: "ended",
		className: "border-border bg-muted text-muted-foreground",
		dotClassName: "bg-muted-foreground",
		pulse: false,
	};
}

function getEmptyStateCopy(connection: LiveEventsConnectionState): string {
	if (connection.status === "connecting") {
		return "Opening live event stream…";
	}
	if (connection.status === "live") {
		return "Stream is open. No events yet.";
	}
	if (connection.status === "reconnecting") {
		return "Live events paused — reconnecting…";
	}
	if (connection.reason === "unavailable") {
		return "Live events aren't available on this server. Logs and checkpoints are still up to date.";
	}
	if (connection.reason === "run_finished") {
		return "Run finished without emitting any live events.";
	}
	return "Live event stream ended unexpectedly.";
}

function getRowBorderClass(event: ExecutionLiveEvent): string {
	if (
		event.kind === "kitaru.checkpoint.failed" ||
		event.kind === "openai_agents.stream.error"
	) {
		return "border-l-2 border-l-destructive";
	}
	if (event.category === "checkpoint_progress") {
		return "border-l-2 border-l-info";
	}
	if (event.category === "openai_stream_lifecycle") {
		return "border-l-2 border-l-span-memory";
	}
	if (event.category === "custom") {
		return "border-l-2 border-l-span-tool";
	}
	return "border-l-2 border-l-primary";
}

function getEventMessage(event: ExecutionLiveEvent): string {
	if (event.message) {
		return event.message;
	}
	if (event.kind === "kitaru.checkpoint.started") {
		return "started";
	}
	if (event.kind === "kitaru.checkpoint.completed") {
		return "completed";
	}
	if (event.kind === "kitaru.checkpoint.failed") {
		return "failed";
	}
	if (event.kind === "openai_agents.stream.start") {
		return "OpenAI stream started";
	}
	if (event.kind === "openai_agents.stream.end") {
		return "OpenAI stream ended";
	}
	if (event.kind === "openai_agents.stream.error") {
		return "OpenAI stream failed";
	}
	return event.display ?? event.kind;
}

function formatEventTimestamp(
	event: ExecutionLiveEvent,
	executionStartTime: Date | undefined
): string {
	if (!event.timestamp || !executionStartTime) {
		return "live";
	}
	const elapsedMs = Math.max(
		0,
		event.timestamp.getTime() - executionStartTime.getTime()
	);
	const totalSeconds = Math.floor(elapsedMs / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`;
}
