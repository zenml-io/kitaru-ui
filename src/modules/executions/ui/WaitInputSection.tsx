import { useRef, useState } from "react";
import { withTheme } from "@rjsf/core";
import type RjsfForm from "@rjsf/core";
import { Theme as shadcnTheme } from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";
import { Button } from "@/shared/ui/button";
import { ColorDot } from "@/shared/ui/ColorDot";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import type { WaitCondition } from "../domain/wait-condition";
import type { ResolveWaitConditionParams } from "../domain/resolve-wait-condition";

type WaitInputSectionProps = {
	waitCondition: WaitCondition;
	onResolve?: (params: ResolveWaitConditionParams) => void;
};

const Form = withTheme(shadcnTheme);

const UI_SCHEMA = {
	"ui:submitButtonOptions": { norender: true },
	"ui:title": "",
	"ui:description": "",
};

export function WaitInputSection({
	waitCondition,
	onResolve,
}: WaitInputSectionProps) {
	const [isOpen, setIsOpen] = useState(true);
	const formRef = useRef<RjsfForm>(null);

	function handleSubmit() {
		if (waitCondition.dataSchema) {
			formRef.current?.submit();
		} else {
			onResolve?.({
				waitConditionId: waitCondition.id,
				resolution: "continue",
			});
		}
	}

	function handleDecline() {
		onResolve?.({
			waitConditionId: waitCondition.id,
			resolution: "abort",
		});
	}

	if (!isOpen) {
		return (
			<button
				type="button"
				className="bg-card hover:bg-accent/30 flex h-10 w-full shrink-0 cursor-pointer items-center gap-2 px-4 text-left transition-colors"
				aria-label="Expand wait input panel"
				onClick={() => setIsOpen(true)}
			>
				<ColorDot shape="round" size="sm" className="bg-warning" />
				<span className="text-foreground truncate font-mono text-xs font-semibold">
					{waitCondition.name}
				</span>
				{waitCondition.question && (
					<span className="text-muted-foreground flex-1 truncate text-xs">
						{waitCondition.question}
					</span>
				)}
				<ChevronUp className="text-muted-foreground size-3.5 shrink-0" />
			</button>
		);
	}

	return (
		<div className="bg-card flex flex-col">
			<div className="border-border flex shrink-0 flex-col gap-1 border-b px-4 py-2">
				<div className="flex items-center gap-2">
					<ColorDot shape="round" size="sm" className="bg-warning" />
					<span className="text-foreground truncate font-mono text-xs font-semibold">
						{waitCondition.name}
					</span>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="text-muted-foreground hover:text-foreground ml-auto shrink-0"
						aria-label="Collapse wait input"
					>
						<ChevronDown className="size-3.5" />
					</button>
				</div>
				{waitCondition.question && (
					<span className="text-muted-foreground text-xs">
						{waitCondition.question}
					</span>
				)}
			</div>

			<div className="max-h-80 overflow-y-auto">
				<div className="flex flex-col gap-4 p-4">
					{waitCondition.dataSchema && (
						<div className="text-xs [&_button]:text-xs [&_input]:text-xs [&_label]:text-xs">
							<Form
								ref={formRef}
								schema={waitCondition.dataSchema as object}
								validator={validator}
								uiSchema={UI_SCHEMA}
								onSubmit={({ formData }) =>
									onResolve?.({
										waitConditionId: waitCondition.id,
										resolution: "continue",
										result: formData,
									})
								}
							/>
						</div>
					)}

					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="flex-1"
							onClick={handleDecline}
						>
							Decline
						</Button>
						<Button
							type="button"
							size="sm"
							className="flex-1"
							onClick={handleSubmit}
						>
							<Send className="size-3.5" />
							Submit
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
