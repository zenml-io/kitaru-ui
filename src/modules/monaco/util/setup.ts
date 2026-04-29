import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import yamlWorker from "monaco-yaml/yaml.worker?worker";

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "yaml") return new yamlWorker();
		return new editorWorker();
	},
};

loader.config({ monaco });
