import { describe, expect, it } from "vitest";
import type { Deployment } from "./deployment";
import {
	buildLocalDeployment,
	isLocalDeployment,
	LOCAL_VERSION_ID,
	withLocalDeployment,
} from "./local-deployment";

function mkDeployment(overrides: Partial<Deployment> = {}): Deployment {
	return {
		id: "snap-1",
		flowId: "flow-1",
		flowName: "research_agent",
		versionNumber: 1,
		tags: [],
		runnable: true,
		deployable: true,
		...overrides,
	};
}

describe("buildLocalDeployment", () => {
	it("produces a deployment whose id equals LOCAL_VERSION_ID", () => {
		const local = buildLocalDeployment("flow-1", "research_agent");
		expect(local.id).toBe(LOCAL_VERSION_ID);
		expect(local.flowId).toBe("flow-1");
		expect(local.flowName).toBe("research_agent");
		expect(local.tags).toEqual([]);
		expect(local.runnable).toBe(false);
		expect(local.deployable).toBe(false);
	});
});

describe("isLocalDeployment", () => {
	it("returns true for the synthetic local deployment", () => {
		expect(
			isLocalDeployment(buildLocalDeployment("flow-1", "research_agent"))
		).toBe(true);
	});

	it("returns false for a real deployment", () => {
		expect(isLocalDeployment(mkDeployment())).toBe(false);
	});

	it("returns false for undefined", () => {
		expect(isLocalDeployment(undefined)).toBe(false);
	});
});

describe("withLocalDeployment", () => {
	it("appends the synthetic local entry to the real deployments list", () => {
		const real = [mkDeployment()];
		const result = withLocalDeployment(real, "flow-1", "research_agent");
		expect(result).toHaveLength(2);
		expect(result[0]).toBe(real[0]);
		expect(result[1].id).toBe(LOCAL_VERSION_ID);
	});

	it("works with an empty deployments list", () => {
		const result = withLocalDeployment([], "flow-1", "research_agent");
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(LOCAL_VERSION_ID);
	});
});
