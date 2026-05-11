import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider } from "next-themes";
import type { JsonSchema } from "@/shared/api/domain/json-schema";
import { MonacoJsonSchemaEditor } from "./MonacoJsonSchemaEditor";

const invocationSchema: JsonSchema = {
	type: "object",
	properties: {
		mode: {
			type: "string",
			enum: ["sync", "async"],
		},
		retries: {
			type: "integer",
			minimum: 0,
			maximum: 5,
		},
		enabled: {
			type: "boolean",
		},
	},
	required: ["mode", "retries"],
	additionalProperties: false,
};

const validInvocationPayload = JSON.stringify(
	{
		mode: "sync",
		retries: 2,
		enabled: true,
	},
	null,
	2
);

const invalidInvocationPayload = JSON.stringify(
	{
		mode: "stream",
		retries: -1,
		enabled: true,
	},
	null,
	2
);

const meta: Meta<typeof MonacoJsonSchemaEditor> = {
	title: "Executions/MonacoJsonSchemaEditor",
	component: MonacoJsonSchemaEditor,
	parameters: {
		layout: "padded",
	},
	args: {
		height: 320,
		jsonSchema: invocationSchema,
	},
};

export default meta;

type Story = StoryObj<typeof MonacoJsonSchemaEditor>;

function withForcedTheme(theme: "light" | "dark"): Decorator {
	return (StoryComponent) => (
		<ThemeProvider attribute="class" enableSystem={false} forcedTheme={theme}>
			<div className="bg-background rounded-md border p-4">
				<StoryComponent />
			</div>
		</ThemeProvider>
	);
}

export const LightMode: Story = {
	args: {
		schemaId: "storybook-light-json-schema",
		value: validInvocationPayload,
	},
	decorators: [withForcedTheme("light")],
};

export const DarkMode: Story = {
	args: {
		schemaId: "storybook-dark-json-schema",
		value: validInvocationPayload,
	},
	decorators: [withForcedTheme("dark")],
};

export const DarkModeInvalidSchema: Story = {
	args: {
		schemaId: "storybook-dark-invalid-json-schema",
		value: invalidInvocationPayload,
	},
	decorators: [withForcedTheme("dark")],
};
