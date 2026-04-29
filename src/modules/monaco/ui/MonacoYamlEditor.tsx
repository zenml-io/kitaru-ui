import "@/modules/monaco/util/setup";
import { cn } from "@/shared/utils/styles";
import type { BeforeMount, EditorProps, OnMount } from "@monaco-editor/react";
import Monaco from "@monaco-editor/react";
import { configureMonacoYaml } from "monaco-yaml";
import { useTheme } from "next-themes";
import { getMonacoYamlInstance, setMonacoYamlInstance } from "./yaml-instance";

type MonacoYamlEditorProps = EditorProps & {
	jsonSchema?: Record<string, unknown>;
	schemaId: string;
};

export function MonacoYamlEditor({
	jsonSchema,
	schemaId,
	className,
	onMount,
	...props
}: MonacoYamlEditorProps) {
	const modelUri = `inmemory://kitaru-yaml-editor-${schemaId}.yaml`;
	const schemaUri = `https://kitaru.com/yaml-schema-${schemaId}.json`;
	const { resolvedTheme } = useTheme();
	const theme = resolvedTheme === "dark" ? "vs-dark" : "vs";

	const handleYamlMount: OnMount = () => {
		getMonacoYamlInstance()
			?.update({
				schemas: [
					{
						uri: schemaUri,
						fileMatch: [modelUri],
						schema: jsonSchema,
					},
				],
			})
			.then(() => {
				"clled";
			});
	};

	const beforeMount: BeforeMount = (monaco) => {
		if (!getMonacoYamlInstance) {
			setMonacoYamlInstance(configureMonacoYaml(monaco));
		}
	};

	return (
		<Monaco
			theme={theme}
			path={modelUri}
			beforeMount={beforeMount}
			onMount={(editor, monaco) => {
				handleYamlMount(editor, monaco);
				onMount?.(editor, monaco);
			}}
			options={{
				fontSize: 14,
				minimap: {
					enabled: false,
				},
			}}
			language="yaml"
			{...props}
			className={cn("border", className)}
		/>
	);
}
