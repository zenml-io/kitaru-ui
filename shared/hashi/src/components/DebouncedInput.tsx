import { debounce } from "es-toolkit/function";
import {
	type ChangeEvent,
	type ComponentProps,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Input } from "@zenml/hashi/primitives/input";

type InputProps = ComponentProps<typeof Input>;

type DebouncedInputProps = Omit<InputProps, "defaultValue" | "onChange" | "value"> & {
	value: string;
	debounceMs?: number;
	onChange?: InputProps["onChange"];
	onValueChange?: (value: string) => void;
	onDebouncedValueChange?: (value: string) => void;
};

export function DebouncedInput({
	value,
	debounceMs = 300,
	onChange,
	onValueChange,
	onDebouncedValueChange,
	...props
}: DebouncedInputProps) {
	const [inputState, setInputState] = useState(() => ({
		value,
		controlledValue: value,
	}));

	const debouncedValueChange = useMemo(
		() =>
			debounce((nextValue: string) => {
				onDebouncedValueChange?.(nextValue);
			}, debounceMs),
		[debounceMs, onDebouncedValueChange]
	);

	if (value !== inputState.controlledValue) {
		setInputState({
			value,
			controlledValue: value,
		});
	}

	useEffect(() => {
		debouncedValueChange.cancel();
	}, [debouncedValueChange, value]);

	useEffect(() => {
		return () => debouncedValueChange.cancel();
	}, [debouncedValueChange]);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const nextValue = event.target.value;

		setInputState({
			value: nextValue,
			controlledValue: value,
		});
		onChange?.(event);
		onValueChange?.(nextValue);
		debouncedValueChange(nextValue);
	}

	return <Input {...props} value={inputState.value} onChange={handleChange} />;
}
