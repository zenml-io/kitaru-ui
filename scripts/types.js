import fs from "node:fs";
import openapiTS, { astToString } from "openapi-typescript";

// Logging function with emojis
function log(message, emoji) {
	console.log(`${emoji} ${message}`);
}

async function generateTypes(baseUrl) {
	log("Script started.", "✨");

	const ast = await openapiTS(new URL(`${baseUrl}/openapi.json`), {
		exportType: true,
		defaultNonNullable: false,
		transform: (schema) => {
			customTransformer(schema);
		},
	});

	log("Writing output to file...", "📝");
	const contents = astToString(ast);
	fs.writeFileSync("./src/shared/api/types.ts", contents);

	log("Script completed successfully.", "✅");
}

/**
 *
 * @param {import("openapi-typescript").SchemaObject} schema
 * @returns {import("openapi-typescript").SchemaObject}
 */
export function customTransformer(schema) {
	if (schema.type === "object" && !schema.properties) {
		schema.additionalProperties = true;
	}
	return schema;
}

// Check if the script is called with at least one argument
if (process.argv.length < 4) {
	console.error("Usage: pnpm generate:types -- <baseurl>");
	process.exit(1);
}

// Take the base URL from the first argument
const baseUrl = process.argv[3];
generateTypes(baseUrl);
