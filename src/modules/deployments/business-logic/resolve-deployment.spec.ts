import { describe, expect, it } from "vitest";
import type { Deployment } from "../domain/deployment";
import type { Execution } from "@/modules/executions/domain/execution";
import {
	resolveDefaultDeployment,
	resolveDeploymentByExclusiveTag,
	resolveDeploymentByVersion,
	resolveDeploymentForExecution,
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

describe("resolveDeploymentForExecution", () => {
	it("returns the deployment matching execution.snapshotId", () => {
		const exec = mkExecution({ snapshotId: "snap-2" });
		expect(resolveDeploymentForExecution(exec, deployments)).toBe(d2);
	});

	it("returns undefined when execution has no snapshotId", () => {
		const exec = mkExecution({ snapshotId: undefined });
		expect(resolveDeploymentForExecution(exec, deployments)).toBeUndefined();
	});

	it("returns undefined when the snapshotId isn't in the list", () => {
		const exec = mkExecution({ snapshotId: "snap-missing" });
		expect(resolveDeploymentForExecution(exec, deployments)).toBeUndefined();
	});
});
