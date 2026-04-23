import { Check, Copy, Info } from "lucide-react";

import { useCopy } from "@/shared/business-logic/use-copy";
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
	return [
		"from zenml.client import Client",
		"",
		`secret = Client().get_secret("${escapePyStr(secretName)}")`,
		access,
	].join("\n");
}

export function SecretInfoTooltip({
	secretName,
	keyName,
}: SecretInfoTooltipProps) {
	const code = buildSnippet(secretName, keyName);
	const { copied, copy } = useCopy();

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
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
						}}
					>
						<Info className="text-muted-foreground" />
					</Button>
				}
			/>
			<TooltipContent
				side="right"
				className="bg-card text-card-foreground ring-foreground/10 flex max-w-sm flex-col gap-2 p-3 ring-1"
			>
				<p className="text-muted-foreground text-xs">
					To use your secret in a step, you can use the following code:
				</p>
				<div className="bg-background/50 relative overflow-hidden rounded-md">
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label={copied ? "Copied" : "Copy code"}
						className="text-muted-foreground hover:text-foreground absolute top-2 right-2 z-10"
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							copy(code);
						}}
					>
						{copied ? <Check /> : <Copy />}
					</Button>
					<CodeBlock code={code} language="python" wrap />
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
