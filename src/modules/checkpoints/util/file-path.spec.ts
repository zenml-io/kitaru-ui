import { describe, expect, it } from "vitest";
import { filePathToFileName, pythonModuleToFilePath } from "./file-path";

describe("pythonModuleToFilePath", () => {
	it("converts dotted module path to filesystem path with .py", () => {
		expect(pythonModuleToFilePath("src.flows.content_pipeline")).toBe(
			"src/flows/content_pipeline.py"
		);
	});

	it("handles a single-segment module", () => {
		expect(pythonModuleToFilePath("main")).toBe("main.py");
	});
});

describe("filePathToFileName", () => {
	it("returns the basename without the file extension", () => {
		expect(filePathToFileName("src/flows/content_pipeline.py")).toBe(
			"content_pipeline"
		);
	});

	it("strips any single extension", () => {
		expect(filePathToFileName("src/flows/notebook.ipynb")).toBe("notebook");
	});

	it("returns the basename when the path has no slashes", () => {
		expect(filePathToFileName("main.py")).toBe("main");
	});

	it("returns the basename unchanged when there is no extension", () => {
		expect(filePathToFileName("src/flows/main")).toBe("main");
	});
});
