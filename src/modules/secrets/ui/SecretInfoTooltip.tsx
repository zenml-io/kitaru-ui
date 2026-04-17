import { Info } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { CodeBlock } from "@/shared/ui/CodeBlock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type SecretInfoTooltipProps = {
	secretName: string;
	keyName?: string;
};

function escapePyStr(s: string) {
	return s
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r");
}

function buildSnippet(secretName: string, keyName?: string) {
	const access = keyName
		? `value = secret.secret_values["${escapePyStr(keyName)}"]`
		: `# secret.secret_values contains all key-value pairs`;
	return `from zenml.client import Client

secret = Client().get_secret("${escapePyStr(secretName)}")
${access}`;
}

export function SecretInfoTooltip({
	secretName,
	keyName,
}: SecretInfoTooltipProps) {
	const code = buildSnippet(secretName, keyName);
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label={
							keyName
								? `Show usage snippet for ${keyName}`
								: `Show usage snippet for ${secretName}`
						}
					>
						<Info className="text-muted-foreground" />
					</Button>
				}
			/>
			<TooltipContent
				side="right"
				className="bg-card text-card-foreground ring-foreground/10 max-w-sm p-0 ring-1"
			>
				<CodeBlock code={code} language="python" wrap />
			</TooltipContent>
		</Tooltip>
	);
}
