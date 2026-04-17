import { useEffect } from "react";
import { useGroupRef, usePanelRef } from "react-resizable-panels";
import type { PanelSize } from "react-resizable-panels";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./resizable";
import {
	ToggleLeftPanelButton,
	ToggleRightPanelButton,
	useThreePanelLayoutInternal,
} from "./ThreePanelLayoutContext";

const PANEL_IDS = { left: "left", center: "center", right: "right" } as const;

const DEFAULT_SIZES = {
	left: { default: 20, min: 10 },
	center: { default: 50, min: 30 },
	right: { default: 30, min: 10 },
} as const;

interface ThreePanelLayoutProps {
	left: React.ReactNode;
	center: React.ReactNode;
	right: React.ReactNode;
	centerHeader?: React.ReactNode;
	hideRight?: boolean;
	hideCenterHeader?: boolean;
}

export function ThreePanelLayout({
	left,
	center,
	right,
	centerHeader,
	hideRight = false,
	hideCenterHeader = false,
}: ThreePanelLayoutProps) {
	const groupRef = useGroupRef();
	const leftPanelRef = usePanelRef();
	const rightPanelRef = usePanelRef();

	const {
		setLeftPanelApi,
		setRightPanelApi,
		setLeftAvailable,
		setRightAvailable,
		onLeftCollapse,
		onLeftExpand,
		onRightCollapse,
		onRightExpand,
	} = useThreePanelLayoutInternal();

	useEffect(() => {
		setLeftPanelApi({
			expand: () => leftPanelRef.current?.expand(),
			collapse: () => leftPanelRef.current?.collapse(),
		});
		setLeftAvailable(true);
		return () => {
			setLeftPanelApi(null);
			setLeftAvailable(false);
		};
	}, [leftPanelRef, setLeftPanelApi, setLeftAvailable]);

	useEffect(() => {
		if (hideRight) {
			setRightPanelApi(null);
			setRightAvailable(false);
			return;
		}
		setRightPanelApi({
			expand: () => rightPanelRef.current?.expand(),
			collapse: () => rightPanelRef.current?.collapse(),
		});
		setRightAvailable(true);
		return () => {
			setRightPanelApi(null);
			setRightAvailable(false);
		};
	}, [hideRight, rightPanelRef, setRightPanelApi, setRightAvailable]);

	function handleLeftResize(size: PanelSize) {
		if (size.asPercentage === 0) {
			onLeftCollapse();
		} else {
			onLeftExpand();
		}
	}

	function handleRightResize(size: PanelSize) {
		if (size.asPercentage === 0) {
			onRightCollapse();
		} else {
			onRightExpand();
		}
	}

	function restoreCollapsedOnDragEnd() {
		if (leftPanelRef.current?.isCollapsed()) {
			leftPanelRef.current.expand();
		}
		if (!hideRight && rightPanelRef.current?.isCollapsed()) {
			rightPanelRef.current.expand();
		}
	}

	return (
		<ResizablePanelGroup
			orientation="horizontal"
			className="min-h-0 flex-1"
			groupRef={groupRef}
		>
			<ResizablePanel
				id={PANEL_IDS.left}
				panelRef={leftPanelRef}
				defaultSize={`${DEFAULT_SIZES.left.default}`}
				minSize={`${DEFAULT_SIZES.left.min}`}
				collapsible
				collapsedSize={0}
				onResize={handleLeftResize}
				className="bg-card overflow-y-auto"
			>
				{left}
			</ResizablePanel>

			<ResizableHandle onDragEnd={restoreCollapsedOnDragEnd} />

			<ResizablePanel
				id={PANEL_IDS.center}
				defaultSize={`${DEFAULT_SIZES.center.default}`}
				minSize={`${DEFAULT_SIZES.center.min}`}
			>
				<div className="flex h-full flex-col overflow-hidden">
					{!hideCenterHeader && (
						<header className="flex shrink-0 items-center justify-between border-b px-3 py-2">
							<ToggleLeftPanelButton ariaLabel="Toggle left panel" />
							{centerHeader}
							<ToggleRightPanelButton ariaLabel="Toggle right panel" />
						</header>
					)}
					{center}
				</div>
			</ResizablePanel>

			{!hideRight && (
				<>
					<ResizableHandle onDragEnd={restoreCollapsedOnDragEnd} />
					<ResizablePanel
						id={PANEL_IDS.right}
						panelRef={rightPanelRef}
						defaultSize={`${DEFAULT_SIZES.right.default}`}
						minSize={`${DEFAULT_SIZES.right.min}`}
						collapsible
						collapsedSize={0}
						onResize={handleRightResize}
						className="bg-card overflow-y-auto"
					>
						{right}
					</ResizablePanel>
				</>
			)}
		</ResizablePanelGroup>
	);
}
