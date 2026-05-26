import {
	createContext,
	useContext,
	useMemo,
	useRef,
	useState,
	type ComponentProps,
	type ReactNode,
} from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@zenml/hashi/primitives/button";

type PanelApi = {
	expand: () => void;
	collapse: () => void;
};

export type ThreePanelLayoutContextValue = {
	leftOpen: boolean;
	rightOpen: boolean;
	leftAvailable: boolean;
	rightAvailable: boolean;
	toggleLeft: () => void;
	toggleRight: () => void;
	expandLeft: () => void;
	collapseLeft: () => void;
	expandRight: () => void;
	collapseRight: () => void;
};

type InternalContextValue = {
	setLeftPanelApi: (api: PanelApi | null) => void;
	setRightPanelApi: (api: PanelApi | null) => void;
	setLeftAvailable: (available: boolean) => void;
	setRightAvailable: (available: boolean) => void;
	onLeftCollapse: () => void;
	onLeftExpand: () => void;
	onRightCollapse: () => void;
	onRightExpand: () => void;
};

const ThreePanelLayoutContext =
	createContext<ThreePanelLayoutContextValue | null>(null);
const ThreePanelLayoutInternalContext =
	createContext<InternalContextValue | null>(null);

type ProviderProps = {
	children: ReactNode;
};

export function ThreePanelLayoutProvider({ children }: ProviderProps) {
	const [leftOpen, setLeftOpen] = useState(true);
	const [rightOpen, setRightOpen] = useState(true);
	const [leftAvailable, setLeftAvailable] = useState(false);
	const [rightAvailable, setRightAvailable] = useState(false);

	const leftPanelApi = useRef<PanelApi | null>(null);
	const rightPanelApi = useRef<PanelApi | null>(null);

	const value: ThreePanelLayoutContextValue = {
		leftOpen,
		rightOpen,
		leftAvailable,
		rightAvailable,
		toggleLeft: () => {
			if (leftOpen) leftPanelApi.current?.collapse();
			else leftPanelApi.current?.expand();
		},
		toggleRight: () => {
			if (rightOpen) rightPanelApi.current?.collapse();
			else rightPanelApi.current?.expand();
		},
		expandLeft: () => leftPanelApi.current?.expand(),
		collapseLeft: () => leftPanelApi.current?.collapse(),
		expandRight: () => rightPanelApi.current?.expand(),
		collapseRight: () => rightPanelApi.current?.collapse(),
	};

	const internal = useMemo<InternalContextValue>(
		() => ({
			setLeftPanelApi: (api) => {
				leftPanelApi.current = api;
			},
			setRightPanelApi: (api) => {
				rightPanelApi.current = api;
			},
			setLeftAvailable,
			setRightAvailable,
			onLeftCollapse: () => setLeftOpen(false),
			onLeftExpand: () => setLeftOpen(true),
			onRightCollapse: () => setRightOpen(false),
			onRightExpand: () => setRightOpen(true),
		}),
		[]
	);

	return (
		<ThreePanelLayoutContext.Provider value={value}>
			<ThreePanelLayoutInternalContext.Provider value={internal}>
				{children}
			</ThreePanelLayoutInternalContext.Provider>
		</ThreePanelLayoutContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThreePanelLayout(): ThreePanelLayoutContextValue {
	const value = useContext(ThreePanelLayoutContext);
	if (!value) {
		throw new Error(
			"useThreePanelLayout must be used inside a ThreePanelLayoutProvider"
		);
	}
	return value;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThreePanelLayoutInternal(): InternalContextValue {
	const value = useContext(ThreePanelLayoutInternalContext);
	if (!value) {
		throw new Error(
			"useThreePanelLayoutInternal must be used inside a ThreePanelLayoutProvider"
		);
	}
	return value;
}

type ButtonProps = ComponentProps<typeof Button>;
type ButtonVariant = ButtonProps["variant"];
type ButtonSize = ButtonProps["size"];

type AriaLabel = string | ((open: boolean) => string);

function resolveAriaLabel(label: AriaLabel, open: boolean): string {
	return typeof label === "function" ? label(open) : label;
}

type ToggleButtonProps = {
	className?: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
	ariaLabel?: AriaLabel;
};

export function ToggleLeftPanelButton({
	className,
	variant = "ghost",
	size = "icon-sm",
	ariaLabel,
}: ToggleButtonProps) {
	const { leftOpen, leftAvailable, toggleLeft } = useThreePanelLayout();
	if (!leftAvailable) return null;
	const label = resolveAriaLabel(
		ariaLabel ?? ((open) => (open ? "Close left panel" : "Open left panel")),
		leftOpen
	);
	return (
		<Button
			type="button"
			variant={variant}
			size={size}
			className={className}
			aria-label={label}
			onClick={toggleLeft}
		>
			<PanelLeft />
		</Button>
	);
}

export function ToggleRightPanelButton({
	className,
	variant = "ghost",
	size = "icon-sm",
	ariaLabel,
}: ToggleButtonProps) {
	const { rightOpen, rightAvailable, toggleRight } = useThreePanelLayout();
	if (!rightAvailable) return null;
	const label = resolveAriaLabel(
		ariaLabel ?? ((open) => (open ? "Close right panel" : "Open right panel")),
		rightOpen
	);
	return (
		<Button
			type="button"
			variant={variant}
			size={size}
			className={className}
			aria-label={label}
			onClick={toggleRight}
		>
			<PanelRight />
		</Button>
	);
}
