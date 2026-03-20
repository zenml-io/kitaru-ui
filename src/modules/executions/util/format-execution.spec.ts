import { describe, expect, test } from "vitest";
import { formatExecutionIndex, formatExecutionName } from "./execution";

describe("formatExecutionIndex formats execution index as 4-digit zero-padded string", () => {
	describe("happy path - standard indexes", () => {
		const testCases = [
			{ input: 1, expected: "0001", description: "single digit" },
			{ input: 42, expected: "0042", description: "double digits" },
			{ input: 123, expected: "0123", description: "triple digits" },
			{ input: 1234, expected: "1234", description: "four digits" },
		];

		testCases.forEach(({ input, expected, description }) => {
			test(description, () => {
				expect(formatExecutionIndex(input)).toBe(expected);
			});
		});
	});

	describe("edge cases - boundary values", () => {
		test("should handle zero", () => {
			expect(formatExecutionIndex(0)).toBe("0000");
		});

		test("should handle maximum 4-digit value", () => {
			expect(formatExecutionIndex(9999)).toBe("9999");
		});
	});

	describe("edge cases - numbers with more than 4 digits", () => {
		const testCases = [
			{ input: 10000, expected: "10000", description: "minimum 5-digit value" },
			{ input: 12345, expected: "12345", description: "5-digit value" },
			{ input: 99999, expected: "99999", description: "maximum 5-digit value" },
			{
				input: 100000,
				expected: "100000",
				description: "minimum 6-digit value",
			},
			{ input: 123456, expected: "123456", description: "6-digit value" },
			{
				input: 999999,
				expected: "999999",
				description: "maximum 6-digit value",
			},
			{ input: 1000000, expected: "1000000", description: "7-digit value" },
			{
				input: 9999999,
				expected: "9999999",
				description: "maximum 7-digit value",
			},
		];

		testCases.forEach(({ input, expected, description }) => {
			test(description, () => {
				expect(formatExecutionIndex(input)).toBe(expected);
			});
		});
	});
});

describe("formatExecutionName formats execution name with optional index prefix", () => {
	describe("happy path - with index", () => {
		const testCases = [
			{
				name: "my-run",
				index: 1,
				expected: "#0001-my-run",
				description: "single digit index",
			},
			{
				name: "pipeline-run",
				index: 42,
				expected: "#0042-pipeline-run",
				description: "double digit index",
			},
			{
				name: "test-execution",
				index: 1234,
				expected: "#1234-test-execution",
				description: "four digit index",
			},
		];

		testCases.forEach(({ name, index, expected, description }) => {
			test(description, () => {
				expect(formatExecutionName(name, index)).toBe(expected);
			});
		});
	});

	describe("happy path - without index", () => {
		test("should return name unchanged when index is undefined", () => {
			expect(formatExecutionName("my-run")).toBe("my-run");
		});

		test("should return name unchanged when index is undefined (explicit)", () => {
			expect(formatExecutionName("my-run", undefined)).toBe("my-run");
		});
	});

	describe("edge cases - zero index", () => {
		test("should format with zero index", () => {
			expect(formatExecutionName("my-execution", 0)).toBe("#0000-my-execution");
		});
	});

	describe("edge cases - name variations", () => {
		test("should handle empty string name with index", () => {
			expect(formatExecutionName("my-execution", 1)).toBe("#0001-my-execution");
		});

		test("should handle empty string name without index", () => {
			expect(formatExecutionName("my-execution")).toBe("my-execution");
		});

		test("should handle name with special characters", () => {
			expect(formatExecutionName("my_run@v1.0", 1)).toBe("#0001-my_run@v1.0");
		});

		test("should handle name with spaces", () => {
			expect(formatExecutionName("my execution name", 5)).toBe(
				"#0005-my execution name"
			);
		});

		test("should handle name with unicode characters", () => {
			expect(formatExecutionName("execution-🚀", 99)).toBe(
				"#0099-execution-🚀"
			);
		});
	});

	describe("edge cases - indexes with more than 4 digits", () => {
		const testCases = [
			{
				name: "execution",
				index: 10000,
				expected: "#10000-execution",
				description: "minimum 5-digit index",
			},
			{
				name: "execution",
				index: 12345,
				expected: "#12345-execution",
				description: "5-digit index",
			},
			{
				name: "execution",
				index: 99999,
				expected: "#99999-execution",
				description: "maximum 5-digit index",
			},
			{
				name: "execution",
				index: 100000,
				expected: "#100000-execution",
				description: "minimum 6-digit index",
			},
			{
				name: "execution",
				index: 123456,
				expected: "#123456-execution",
				description: "6-digit index",
			},
			{
				name: "execution",
				index: 999999,
				expected: "#999999-execution",
				description: "maximum 6-digit index",
			},
			{
				name: "execution",
				index: 1000000,
				expected: "#1000000-execution",
				description: "7-digit index",
			},
		];

		testCases.forEach(({ name, index, expected, description }) => {
			test(description, () => {
				expect(formatExecutionName(name, index)).toBe(expected);
			});
		});
	});
});
