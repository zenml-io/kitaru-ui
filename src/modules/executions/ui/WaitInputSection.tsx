import { useRef } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Button } from "@/shared/ui/button";
import { ColorDot } from "@/shared/ui/ColorDot";
import { ChevronDown, Send01 } from "@untitledui/icons";
import type { WaitCondition } from "../domain/wait-condition";
import type { ResolveWaitConditionParams } from "../domain/resolve-wait-condition";
import { widgets, templates } from "./wait-form/rjsf-widgets";

type WaitInputSectionProps = {
	waitCondition: WaitCondition;
	onToggle?: () => void;
	onResolve?: (params: ResolveWaitConditionParams) => void;
};

const UI_SCHEMA = {
	"ui:submitButtonOptions": { norender: true },
};

export function WaitInputSection({
	waitCondition,
	onToggle,
	onResolve,
}: WaitInputSectionProps) {
	const formRef = useRef<Form>(null);

	function handleAccept() {
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

	return (
		<div className="bg-card flex flex-col">
			<div className="border-border flex shrink-0 flex-col gap-1 border-b px-4 py-2">
				<div className="flex items-center gap-2">
					<ColorDot shape="round" size="sm" className="bg-warning" />
					<span className="text-foreground truncate font-mono text-xs font-semibold">
						{waitCondition.name}
					</span>
					{onToggle && (
						<button
							type="button"
							onClick={onToggle}
							className="text-muted-foreground hover:text-foreground ml-auto shrink-0"
							aria-label="Collapse wait input"
						>
							<ChevronDown className="size-3.5" />
						</button>
					)}
				</div>
				{waitCondition.question && (
					<span className="text-muted-foreground text-xs">
						{waitCondition.question}
					</span>
				)}
			</div>

			<div className="flex flex-col gap-4 p-4">
				{waitCondition.dataSchema && (
					<Form
						ref={formRef}
						schema={waitCondition.dataSchema as object}
						validator={validator}
						widgets={widgets}
						templates={templates}
						uiSchema={UI_SCHEMA}
						onSubmit={({ formData }) =>
							onResolve?.({
								waitConditionId: waitCondition.id,
								resolution: "continue",
								result: formData,
							})
						}
					/>
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
						onClick={handleAccept}
					>
						<Send01 className="size-3.5" />
						Accept
					</Button>
				</div>
			</div>
		</div>
	);
}
