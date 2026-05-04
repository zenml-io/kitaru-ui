import "@/modules/executions/feature/setup-monaco";
import type { JsonSchema } from "@/shared/api/domain/json-schema";
import { cn } from "@/shared/utils/styles";
import type { EditorProps, OnMount } from "@monaco-editor/react";
import Monaco from "@monaco-editor/react";
import { useTheme } from "next-themes";

type MonacoYamlEditorProps = EditorProps & {
	jsonSchema?: JsonSchema;
	schemaId: string;
};

export function MonacoJsonSchemaEditor({
	jsonSchema,
	schemaId,
	className,
	onMount,
	...props
}: MonacoYamlEditorProps) {
	const { resolvedTheme } = useTheme();
	const theme = resolvedTheme === "dark" ? "vs-dark" : "vs";

	const fileMatch = `${schemaId}.json`;

	const handleEditorMount: OnMount = (_editor, monaco) => {
		// Configure JSON language defaults with schema validation
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			enableSchemaRequest: true,
			validate: true,
			schemas: [
				{
					uri: `model-input-schema-${schemaId}.json`,
					fileMatch: [fileMatch],
					schema: jsonSchema,
				},
			],
		});
	};

	return (
		<Monaco
			theme={theme}
			path={fileMatch}
			onMount={(editor, monaco) => {
				handleEditorMount(editor, monaco);
				onMount?.(editor, monaco);
			}}
			options={{
				fontSize: 14,
				minimap: {
					enabled: false,
				},
			}}
			language="json"
			{...props}
			className={cn("border", className)}
		/>
	);
}
