export type ArtifactStoreState =
	| { kind: "local"; uri?: string }
	| { kind: "remote-no-connector"; uri?: string }
	| { kind: "remote-ok" }
	| { kind: "unknown" };
