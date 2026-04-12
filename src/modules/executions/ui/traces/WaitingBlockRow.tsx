import { withTheme } from "@rjsf/core";
import { Theme as shadcnTheme } from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";
import { CheckpointTypeBadge } from "./CheckpointTypeBadge";
import { ContentCard } from "./ContentCard";
import { ExpandableRow } from "./ExpandableRow";
import { formatDurationShort } from "@/shared/utils/time";
import type { WaitingBlock } from "../../domain/waiting-block";

const Form = withTheme(shadcnTheme);

const UI_SCHEMA = {
	"ui:submitButtonOptions": { norender: true },
	"ui:title": "",
	"ui:description": "",
};

type WaitingBlockRowProps = {
	waitingBlock: WaitingBlock;
};

export function WaitingBlockRow({ waitingBlock }: WaitingBlockRowProps) {
	return (
		<ExpandableRow
			header={
				<>
					<CheckpointTypeBadge type="wait" />
					<span className="text-foreground truncate font-mono text-xs font-semibold">
						User Input
					</span>
					<span className="flex-1" />
					{waitingBlock.waitDurationMs != null && (
						<span className="text-2xs text-muted-foreground font-mono tabular-nums">
							{formatDurationShort(waitingBlock.waitDurationMs)}
						</span>
					)}
				</>
			}
		>
			<div className="flex flex-col gap-3 px-4 py-4">
				{waitingBlock.question && (
					<ContentCard title="Question">
						<div className="px-5 py-4">
							<p className="text-foreground text-sm leading-snug">
								{waitingBlock.question}
							</p>
						</div>
					</ContentCard>
				)}
				{waitingBlock.dataSchema ? (
					<ContentCard title="Response">
						<div className="px-5 py-4 text-xs [&_button]:text-xs [&_input]:text-xs [&_label]:text-xs">
							<Form
								schema={waitingBlock.dataSchema as object}
								formData={waitingBlock.result}
								validator={validator}
								uiSchema={UI_SCHEMA}
								readonly
							/>
						</div>
					</ContentCard>
				) : (
					waitingBlock.answer && (
						<ContentCard title="Response">
							<div className="px-5 py-4">
								<p className="text-foreground text-sm leading-snug">
									{waitingBlock.answer}
								</p>
							</div>
						</ContentCard>
					)
				)}
			</div>
		</ExpandableRow>
	);
}
