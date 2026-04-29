import type { MonacoYaml } from "monaco-yaml";

let monacoYamlInstance: MonacoYaml | null = null;

export function getMonacoYamlInstance(): MonacoYaml | null {
	return monacoYamlInstance;
}

export function setMonacoYamlInstance(instance: MonacoYaml) {
	monacoYamlInstance = instance;
}
