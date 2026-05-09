import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { getIsActiveStatus } from "@/shared/business-logic/status";
import { isFetchError } from "@/shared/api/domain/fetch-error";
import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";
import type { ExecutionStatus } from "../domain/execution";
import { fetchExecutionEventStream } from "../domain/fetch-execution-event-stream";
import {
	buildCheckpointIdentityLookup,
	getLiveEventDedupeKey,
	mapSseFrameToLiveEventAction,
	type CheckpointIdentityLookup,
	type ExecutionLiveEvent,
} from "../domain/live-event";
import type {
	ExecutionLiveEventsState,
	LiveEventsConnectionState,
	LiveEventsEndedReason,
} from "../domain/live-event-state";

export type ExecutionLiveEventsReducerAction =
	| { type: "reset" }
	| { type: "connecting" }
	| { type: "opened" }
	| { type: "event"; event: ExecutionLiveEvent }
	| { type: "gap"; reason?: string }
	| { type: "reconnecting"; reason: string }
	| { type: "ended"; reason?: LiveEventsEndedReason; canRetry: boolean }
	| { type: "unavailable"; canRetry: boolean }
	| { type: "server-error"; reason?: string };

export type UseExecutionLiveEventsResult = ExecutionLiveEventsState & {
	checkpointLookup: CheckpointIdentityLookup;
	retry: () => void;
};

export function createInitialExecutionLiveEventsState(): ExecutionLiveEventsState {
	return {
		connection: { status: "connecting" },
		rows: [],
		seenKeys: new Set(),
	};
}

export function executionLiveEventsReducer(
	state: ExecutionLiveEventsState,
	action: ExecutionLiveEventsReducerAction
): ExecutionLiveEventsState {
	if (action.type === "reset") {
		return createInitialExecutionLiveEventsState();
	}
	if (action.type === "connecting") {
		return { ...state, connection: { status: "connecting" } };
	}
	if (action.type === "opened") {
		return {
			...state,
			connection: {
				status: "live",
				hadGap: getHadGap(state.connection),
				hadDisconnect: getHadDisconnect(state.connection),
			},
		};
	}
	if (action.type === "event") {
		return appendLiveEvent(state, action.event);
	}
	if (action.type === "gap") {
		return appendGap(state, action.reason);
	}
	if (action.type === "reconnecting") {
		return {
			...state,
			connection: {
				status: "reconnecting",
				reason: action.reason,
				hadGap: getHadGap(state.connection),
				hadDisconnect: true,
			},
		};
	}
	if (action.type === "ended") {
		return {
			...state,
			connection: {
				status: "ended",
				reason: action.reason,
				canRetry: action.canRetry,
				hadGap: getHadGap(state.connection),
				hadDisconnect: getHadDisconnect(state.connection),
			},
		};
	}
	if (action.type === "unavailable") {
		return {
			...state,
			connection: {
				status: "ended",
				reason: "unavailable",
				canRetry: action.canRetry,
				hadGap: getHadGap(state.connection),
				hadDisconnect: getHadDisconnect(state.connection),
			},
		};
	}
	return {
		...state,
		connection: {
			status: "ended",
			reason: "stream_error",
			canRetry: true,
			hadGap: getHadGap(state.connection),
			hadDisconnect: getHadDisconnect(state.connection),
		},
	};
}

export function useExecutionLiveEvents(
	executionId: string,
	executionStatus: ExecutionStatus | undefined,
	checkpoints: CheckpointEntry[]
): UseExecutionLiveEventsResult {
	const [state, dispatch] = useReducer(
		executionLiveEventsReducer,
		undefined,
		createInitialExecutionLiveEventsState
	);
	const [retryAttempt, setRetryAttempt] = useState(0);
	const lastEventIdRef = useRef<string | undefined>(undefined);
	const isActive = getIsActiveStatus(executionStatus);
	const checkpointLookup = useMemo(
		() => buildCheckpointIdentityLookup(checkpoints),
		[checkpoints]
	);

	useEffect(() => {
		lastEventIdRef.current = undefined;
		dispatch({ type: "reset" });
	}, [executionId]);

	useEffect(() => {
		const maxReconnectAttempts = 3;

		if (!isActive) {
			dispatch({ type: "ended", reason: "run_finished", canRetry: false });
			return;
		}

		const controller = new AbortController();
		let stopped = false;

		async function connectLoop() {
			let attempt = 0;
			while (!stopped && !controller.signal.aborted) {
				if (attempt === 0) {
					dispatch({ type: "connecting" });
				} else {
					dispatch({ type: "reconnecting", reason: "connection_lost" });
				}

				const terminal = { value: false };
				try {
					await fetchExecutionEventStream({
						executionId,
						lastEventId: lastEventIdRef.current,
						signal: controller.signal,
						onOpen: () => dispatch({ type: "opened" }),
						onFrame: (frame) => {
							if (frame.id) {
								lastEventIdRef.current = frame.id;
							}
							const mapped = mapSseFrameToLiveEventAction(frame, executionId);
							if (mapped.type === "event") {
								dispatch({ type: "event", event: mapped.event });
							} else if (mapped.type === "gap") {
								dispatch({ type: "gap", reason: mapped.reason });
							} else if (mapped.type === "error") {
								terminal.value = true;
								dispatch({ type: "server-error", reason: mapped.reason });
								return false;
							} else if (mapped.type === "end") {
								terminal.value = true;
								dispatch({
									type: "ended",
									reason: "run_finished",
									canRetry: false,
								});
								return false;
							}
						},
					});
					if (terminal.value || stopped || controller.signal.aborted) {
						return;
					}
				} catch (error) {
					if (stopped || controller.signal.aborted || isAbortError(error)) {
						return;
					}
					if (isUnavailableError(error)) {
						dispatch({
							type: "unavailable",
							canRetry: isRetryableUnavailableError(error),
						});
						return;
					}
				}

				attempt += 1;
				if (attempt >= maxReconnectAttempts) {
					dispatch({ type: "ended", reason: "disconnected", canRetry: true });
					return;
				}
				dispatch({ type: "reconnecting", reason: "connection_lost" });
				await waitForReconnect(controller.signal, 1_000);
			}
		}

		void connectLoop();

		return () => {
			stopped = true;
			controller.abort();
		};
	}, [executionId, isActive, retryAttempt]);

	const retry = useCallback(() => {
		setRetryAttempt((attempt) => attempt + 1);
	}, []);

	return { ...state, checkpointLookup, retry };
}

function appendLiveEvent(
	state: ExecutionLiveEventsState,
	event: ExecutionLiveEvent
): ExecutionLiveEventsState {
	const dedupeKey = getLiveEventDedupeKey(event);
	if (dedupeKey && state.seenKeys.has(dedupeKey)) {
		return state;
	}

	const seenKeys = new Set(state.seenKeys);
	if (dedupeKey) {
		seenKeys.add(dedupeKey);
	}

	const rowId = dedupeKey ?? `arrival:${state.rows.length}`;
	return {
		...state,
		rows: [...state.rows, { type: "event", id: rowId, event }],
		seenKeys,
	};
}

function appendGap(
	state: ExecutionLiveEventsState,
	reason: string | undefined
): ExecutionLiveEventsState {
	return {
		...state,
		rows: [
			...state.rows,
			{ type: "gap", id: `gap:${state.rows.length}`, reason },
		],
		connection: {
			status: "live",
			hadGap: true,
			hadDisconnect: getHadDisconnect(state.connection),
		},
	};
}

function getHadGap(connection: LiveEventsConnectionState): boolean {
	if (connection.status === "connecting") {
		return false;
	}
	return connection.hadGap;
}

function getHadDisconnect(connection: LiveEventsConnectionState): boolean {
	if (connection.status === "connecting") {
		return false;
	}
	return connection.hadDisconnect;
}

function isAbortError(error: unknown): boolean {
	return error instanceof DOMException && error.name === "AbortError";
}

function isUnavailableError(error: unknown): boolean {
	return (
		isFetchError(error) &&
		(error.status === 404 || error.status === 501 || error.status === 503)
	);
}

function isRetryableUnavailableError(error: unknown): boolean {
	return isFetchError(error) && error.status === 503;
}

function waitForReconnect(signal: AbortSignal, ms: number): Promise<void> {
	return new Promise((resolve) => {
		if (signal.aborted) {
			resolve();
			return;
		}
		const timeout = window.setTimeout(resolve, ms);
		signal.addEventListener(
			"abort",
			() => {
				window.clearTimeout(timeout);
				resolve();
			},
			{ once: true }
		);
	});
}
