import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useCopy } from "@/shared/business-logic/use-copy";
import { Button } from "@/shared/ui/button";
import { CodeBlock } from "@/shared/ui/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

type Language = "curl" | "python" | "javascript" | "cli";

const LABELS: Record<Language, string> = {
	curl: "cURL",
	python: "Python",
	javascript: "JavaScript",
	cli: "CLI",
};

const SHIKI_LANG: Record<Language, string> = {
	curl: "bash",
	python: "python",
	javascript: "javascript",
	cli: "bash",
};

const LANGUAGES = ["curl", "python", "javascript", "cli"] as const;

type SnippetInputs = {
	url: string;
	flowName: string;
	tagOrVersionArgs?: string;
	exampleInput: Record<string, unknown>;
};

function buildRequestBody(exampleInput: Record<string, unknown>) {
	return { run_configuration: { parameters: exampleInput } };
}

function renderCurl({ url, exampleInput }: SnippetInputs) {
	return `curl -X POST ${url} \\
  -H "Authorization: Bearer $KITARU_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(buildRequestBody(exampleInput))}'`;
}

function renderPython({ url, exampleInput }: SnippetInputs) {
	return `import os, requests
response = requests.post(
    "${url}",
    headers={
        "Authorization": f"Bearer {os.environ['KITARU_API_KEY']}",
        "Content-Type": "application/json",
    },
    json=${JSON.stringify(buildRequestBody(exampleInput), null, 2)},
)
response.raise_for_status()
print(response.json())`;
}

function renderJavaScript({ url, exampleInput }: SnippetInputs) {
	return `const payload = ${JSON.stringify(buildRequestBody(exampleInput), null, 2)};
const response = await fetch("${url}", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.KITARU_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
if (!response.ok) throw new Error(await response.text());
console.log(await response.json());`;
}

function renderCli({
	flowName,
	tagOrVersionArgs,
	exampleInput,
}: SnippetInputs) {
	const args = tagOrVersionArgs ? ` ${tagOrVersionArgs}` : "";
	return `kitaru invoke ${flowName}${args} \\
  --input '${JSON.stringify(exampleInput)}'`;
}

const RENDERERS: Record<Language, (i: SnippetInputs) => string> = {
	curl: renderCurl,
	python: renderPython,
	javascript: renderJavaScript,
	cli: renderCli,
};

export function InvocationSnippets(props: SnippetInputs) {
	const [active, setActive] = useState<Language>("curl");
	const code = RENDERERS[active](props);
	const { copied, copy } = useCopy();

	return (
		<div className="border-border bg-card overflow-hidden rounded-md border">
			<Tabs
				value={active}
				onValueChange={(value) => setActive(value as Language)}
			>
				<div className="border-border flex items-center justify-between border-b px-3 py-2">
					<TabsList variant="line">
						{LANGUAGES.map((key) => (
							<TabsTrigger key={key} value={key}>
								{LABELS[key]}
							</TabsTrigger>
						))}
					</TabsList>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => copy(code)}
						aria-label={copied ? "Copied" : "Copy snippet"}
					>
						{copied ? (
							<Check className="text-success size-3.5" />
						) : (
							<Copy className="size-3.5" />
						)}
					</Button>
				</div>
				{LANGUAGES.map((key) => (
					<TabsContent key={key} value={key}>
						<CodeBlock
							code={RENDERERS[key](props)}
							language={SHIKI_LANG[key]}
							wrap
						/>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
