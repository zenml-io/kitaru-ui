import type {
	WidgetProps,
	FieldTemplateProps,
	ObjectFieldTemplateProps,
} from "@rjsf/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";

export function FieldTemplate({
	id,
	label,
	required,
	children,
	errors,
}: FieldTemplateProps) {
	return (
		<div className="flex flex-col gap-1.5">
			{label && id !== "root" && (
				<Label
					htmlFor={id}
					className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase"
				>
					{label}
					{required && <span className="text-destructive ml-0.5">*</span>}
				</Label>
			)}
			{children}
			{errors}
		</div>
	);
}

export function ErrorListTemplate() {
	return null;
}

export function TextWidget({
	id,
	value,
	onChange,
	placeholder,
	disabled,
}: WidgetProps) {
	return (
		<Input
			id={id}
			type="text"
			className="text-xs"
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value || undefined)}
			placeholder={placeholder}
			disabled={disabled}
		/>
	);
}

export function NumberWidget({ id, value, onChange, disabled }: WidgetProps) {
	return (
		<Input
			id={id}
			type="number"
			className="text-xs"
			value={value ?? ""}
			onChange={(e) =>
				onChange(e.target.value === "" ? undefined : Number(e.target.value))
			}
			disabled={disabled}
		/>
	);
}

export function CheckboxWidget({ value, onChange, disabled }: WidgetProps) {
	return (
		<Switch
			size="sm"
			checked={!!value}
			onCheckedChange={(checked) => onChange(checked)}
			disabled={disabled}
		/>
	);
}

export function SelectWidget({
	id,
	value,
	onChange,
	options,
	disabled,
}: WidgetProps) {
	const enumOptions = (options.enumOptions ?? []) as {
		value: unknown;
		label: string;
	}[];
	return (
		<div className="flex flex-wrap gap-1.5">
			{enumOptions.map((opt) => (
				<button
					key={String(opt.value)}
					id={id}
					type="button"
					disabled={disabled}
					onClick={() => onChange(opt.value)}
					className={`rounded-md border px-3 py-1 text-xs transition-colors ${
						value === opt.value
							? "border-primary bg-primary text-primary-foreground"
							: "border-border text-foreground hover:bg-accent/30"
					}`}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const widgets = {
	TextWidget,
	NumberWidget,
	CheckboxWidget,
	SelectWidget,
};

export function ObjectFieldTemplate({ properties }: ObjectFieldTemplateProps) {
	return (
		<div className="flex flex-col gap-4">
			{properties.map((prop) => (
				<div key={prop.name}>{prop.content}</div>
			))}
		</div>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const templates = {
	FieldTemplate,
	ErrorListTemplate,
	ObjectFieldTemplate,
};
