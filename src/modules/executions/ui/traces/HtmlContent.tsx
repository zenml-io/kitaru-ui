import { LockKeyhole } from "lucide-react";

import { ViewerFrame } from "./ViewerFrame";

type HtmlContentProps = {
	value: string;
};

export function HtmlContent({ value }: HtmlContentProps) {
	return (
		<ViewerFrame
			type="html"
			rendered={
				<div className="space-y-3 p-4">
					<div className="text-muted-foreground flex items-center gap-2 text-xs">
						<LockKeyhole className="h-3.5 w-3.5" />
						<span>
							Rendered inside a sandboxed iframe — scripts, forms, and
							navigation are disabled.
						</span>
					</div>
					<iframe
						srcDoc={value}
						sandbox=""
						referrerPolicy="no-referrer"
						className="min-h-64 w-full rounded-md border-0 bg-white"
						title="visualization"
					/>
				</div>
			}
			rawText={value}
			copyText={value}
			sizeLabel={`${value.length} chars`}
			rawLanguage="html"
			density="compact"
		/>
	);
}
