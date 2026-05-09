import type { ExecutionLiveEvent } from "./live-event";

export type LiveEventsConnectionState =
	| { status: "connecting" }
	| { status: "live"; hadGap: boolean; hadDisconnect: boolean }
	| {
			status: "reconnecting";
			reason: string;
			hadGap: boolean;
			hadDisconnect: boolean;
	  }
	| {
			status: "ended";
			reason?: LiveEventsEndedReason;
			canRetry: boolean;
			hadGap: boolean;
			hadDisconnect: boolean;
	  };

export type LiveEventsEndedReason =
	| "run_finished"
	| "unavailable"
	| "stream_error"
	| "disconnected";

export type ExecutionLiveEventsRow =
	| { type: "event"; id: string; event: ExecutionLiveEvent }
	| { type: "gap"; id: string; reason?: string };

export type ExecutionLiveEventsState = {
	connection: LiveEventsConnectionState;
	rows: ExecutionLiveEventsRow[];
	seenKeys: Set<string>;
};
