import { describe, expect, it } from "vitest";
import type { Deployment } from "../domain/deployment";
import {
	LOCAL_VERSION_ID,
	withLocalDeployment,
} from "../domain/local-deployment";
import type { Execution } from "@/modules/executions/domain/execution";
import {
	resolveDefaultDeployment,
	resolveDeploymentByExclusiveTag,
	resolveDeploymentByVersion,
	resolveDeploymentForExecution,
	resolveSelectedDeployment,
} from "./resolve-deployment";

function mkDeployment(overrides: Partial<Deployment>): Deployment {
	return {
		id: "snap-x",
		flowId: "flow-1",
		flowName: "research_agent",
		versionNumber: 1,
		tags: [],
		runnable: true,
		deployable: true,
		...overrides,
	};
}

function mkExecution(overrides: Partial<Execution>): Execution {
	return {
		id: "run-1",
		name: "run",
		index: 1,
		logSources: [],
		...overrides,
	};
}

// Intentionally unsorted — selectors must not depend on list order.
const d3 = mkDeployment({
	id: "snap-3",
	versionNumber: 3,
	tags: [{ id: "t1", name: "default", kind: "default" }],
});
const d2 = mkDeployment({
	id: "snap-2",
	versionNumber: 2,
	tags: [{ id: "t2", name: "beta", kind: "general" }],
});
const d1 = mkDeployment({
	id: "snap-1",
	versionNumber: 1,
	tags: [{ id: "t2", name: "beta", kind: "general" }],
});
const deployments: Deployment[] = [d1, d3, d2];

describe("resolveDefaultDeployment", () => {
	it("returns the deployment carrying the 'default' tag", () => {
		expect(resolveDefaultDeployment(deployments)).toBe(d3);
	});

	it("returns undefined when no deployment has the default tag", () => {
		expect(resolveDefaultDeployment([d2, d1])).toBeUndefined();
	});

	it("returns undefined for an empty list", () => {
		expect(resolveDefaultDeployment([])).toBeUndefined();
	});
});

describe("resolveDeploymentByVersion", () => {
	it("returns the exact-version match", () => {
		expect(resolveDeploymentByVersion(deployments, 2)).toBe(d2);
	});

	it("returns undefined for a missing version", () => {
		expect(resolveDeploymentByVersion(deployments, 99)).toBeUndefined();
	});
});

describe("resolveDeploymentByExclusiveTag", () => {
	it("treats the reserved 'default' tag as exclusive", () => {
		expect(resolveDeploymentByExclusiveTag(deployments, "default")).toBe(d3);
	});

	it("resolves a non-default exclusive tag holder", () => {
		const dCanary = mkDeployment({
			id: "snap-canary",
			versionNumber: 4,
			tags: [{ id: "t3", name: "canary", kind: "exclusive" }],
		});
		expect(
			resolveDeploymentByExclusiveTag([...deployments, dCanary], "canary")
		).toBe(dCanary);
	});

	it("returns undefined when the named tag exists but is not exclusive", () => {
		expect(
			resolveDeploymentByExclusiveTag(deployments, "beta")
		).toBeUndefined();
	});

	it("returns undefined for an unknown tag", () => {
		expect(
			resolveDeploymentByExclusiveTag(deployments, "no-such-tag")
		).toBeUndefined();
	});
});

describe("resolveSelectedDeployment", () => {
	it("returns the deployment matching ?version=N when present", () => {
		expect(resolveSelectedDeployment(deployments, 2)).toBe(d2);
	});

	it("falls back to the default-tag holder when ?version=N is not given", () => {
		expect(resolveSelectedDeployment(deployments, undefined)).toBe(d3);
	});

	it("falls back to the default-tag holder when ?version=N does not match", () => {
		expect(resolveSelectedDeployment(deployments, 99)).toBe(d3);
	});

	it("falls back to the first deployment when no default tag exists", () => {
		const noDefault = [d1, d2];
		expect(resolveSelectedDeployment(noDefault, undefined)).toBe(d1);
	});

	it("returns undefined for an empty list", () => {
		expect(resolveSelectedDeployment([], undefined)).toBeUndefined();
		expect(resolveSelectedDeployment([], 1)).toBeUndefined();
		expect(resolveSelectedDeployment([], LOCAL_VERSION_ID)).toBeUndefined();
	});

	it("selects the synthetic local deployment when version === 'local' and it exists in the list", () => {
		const local = mkDeployment({
			id: "local",
			versionNumber: 0,
			tags: [],
		});
		expect(resolveSelectedDeployment([...deployments, local], "local")).toBe(
			local
		);
	});

	it("falls back to the default-tag holder when version === 'local' but the local entry isn't present", () => {
		expect(resolveSelectedDeployment(deployments, LOCAL_VERSION_ID)).toBe(d3);
	});

	it("resolves the synthetic local entry produced by withLocalDeployment", () => {
		const withLocal = withLocalDeployment(
			deployments,
			"flow-1",
			"research_agent"
		);
		const selected = resolveSelectedDeployment(withLocal, LOCAL_VERSION_ID);
		expect(selected?.id).toBe(LOCAL_VERSION_ID);
	});
});

describe("resolveDeploymentForExecution", () => {
	it("returns the deployment matching execution.snapshotId", () => {
		const exec = mkExecution({ sourceSnapshotId: "snap-2" });
		expect(resolveDeploymentForExecution(exec, deployments)).toBe(d2);
	});

	it("returns undefined when execution has no snapshotId", () => {
		const exec = mkExecution({ sourceSnapshotId: undefined });
		expect(resolveDeploymentForExecution(exec, deployments)).toBeUndefined();
	});

	it("returns undefined when the snapshotId isn't in the list", () => {
		const exec = mkExecution({ sourceSnapshotId: "snap-missing" });
		expect(resolveDeploymentForExecution(exec, deployments)).toBeUndefined();
	});
});
