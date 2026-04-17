import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

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

const ThreePanelLayoutContext =
	createContext<ThreePanelLayoutContextValue | null>(null);

type ProviderProps = {
	children: ReactNode;
	initialLeftOpen?: boolean;
	initialRightOpen?: boolean;
};

export function ThreePanelLayoutProvider({
	children,
	initialLeftOpen = true,
	initialRightOpen = true,
}: ProviderProps) {
	const [leftOpen, setLeftOpen] = useState(initialLeftOpen);
	const [rightOpen, setRightOpen] = useState(initialRightOpen);

	const value = useMemo<ThreePanelLayoutContextValue>(
		() => ({
			leftOpen,
			rightOpen,
			leftAvailable: false,
			rightAvailable: false,
			toggleLeft: () => setLeftOpen((open) => !open),
			toggleRight: () => setRightOpen((open) => !open),
			expandLeft: () => setLeftOpen(true),
			collapseLeft: () => setLeftOpen(false),
			expandRight: () => setRightOpen(true),
			collapseRight: () => setRightOpen(false),
		}),
		[leftOpen, rightOpen]
	);

	return (
		<ThreePanelLayoutContext.Provider value={value}>
			{children}
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
