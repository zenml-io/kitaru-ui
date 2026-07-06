import { describe, expect, it } from "vitest";
import { compactPartial } from "./compact-partial";

describe("compactPartial", () => {
	it("returns an empty object when nothing is set", () => {
		expect(compactPartial<{ q: string }>({})).toEqual({});
	});

	it("keeps defined values", () => {
		expect(compactPartial<{ q: string; n: number }>({ q: "hi", n: 1 })).toEqual(
			{ q: "hi", n: 1 }
		);
	});

	it("strips explicit undefined keys", () => {
		const out = compactPartial<{ q: string; status: string }>({
			q: "hi",
			status: undefined,
		});
		expect(out).toEqual({ q: "hi" });
		expect("status" in out).toBe(false);
	});

	it("keeps falsy but defined values (empty string, zero, false)", () => {
		expect(
			compactPartial<{ q: string; n: number; on: boolean }>({
				q: "",
				n: 0,
				on: false,
			})
		).toEqual({ q: "", n: 0, on: false });
	});

	it("does not mutate the input", () => {
		const input = { q: "hi", status: undefined };
		compactPartial(input);
		expect(input).toEqual({ q: "hi", status: undefined });
	});
});
