import { useImperativeHandle, type Ref } from "react";
import { useGroupRef, usePanelRef } from "react-resizable-panels";
import { LayoutLeft, LayoutRight } from "@untitledui/icons";
import { Button } from "./button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./resizable";

const PANEL_IDS = { left: "left", center: "center", right: "right" } as const;

const DEFAULT_SIZES = {
	left: { default: 20, min: 10 },
	center: { default: 60, min: 30 },
	right: { default: 20, min: 10 },
} as const;

export interface ThreePanelLayoutHandle {
	expandRight(): void;
}

interface ThreePanelLayoutProps {
	ref?: Ref<ThreePanelLayoutHandle>;
	left: React.ReactNode;
	center: React.ReactNode;
	right: React.ReactNode;
	centerHeader?: React.ReactNode;
}

export function ThreePanelLayout({
	ref,
	left,
	center,
	right,
	centerHeader,
}: ThreePanelLayoutProps) {
	const groupRef = useGroupRef();
	const leftPanelRef = usePanelRef();
	const rightPanelRef = usePanelRef();

	useImperativeHandle(ref, () => ({
		expandRight() {
			if (rightPanelRef.current?.isCollapsed()) {
				rightPanelRef.current.expand();
			}
		},
	}));

	function toggleLeft() {
		if (leftPanelRef.current?.isCollapsed()) {
			leftPanelRef.current.expand();
		} else {
			leftPanelRef.current?.collapse();
		}
	}

	function toggleRight() {
		if (rightPanelRef.current?.isCollapsed()) {
			rightPanelRef.current.expand();
		} else {
			rightPanelRef.current?.collapse();
		}
	}

	function restoreCollapsedOnDragEnd() {
		if (leftPanelRef.current?.isCollapsed()) {
			leftPanelRef.current.expand();
		}
		if (rightPanelRef.current?.isCollapsed()) {
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
				<div className="flex h-full flex-col">
					<header className="flex shrink-0 items-center justify-between border-b px-3 py-2">
						<Button variant="ghost" size="icon-sm" onClick={toggleLeft}>
							<LayoutLeft />
							<span className="sr-only">Toggle left panel</span>
						</Button>
						{centerHeader}
						<Button variant="ghost" size="icon-sm" onClick={toggleRight}>
							<LayoutRight />
							<span className="sr-only">Toggle right panel</span>
						</Button>
					</header>
					{center}
				</div>
			</ResizablePanel>

			<ResizableHandle onDragEnd={restoreCollapsedOnDragEnd} />

			<ResizablePanel
				id={PANEL_IDS.right}
				panelRef={rightPanelRef}
				defaultSize={`${DEFAULT_SIZES.right.default}`}
				minSize={`${DEFAULT_SIZES.right.min}`}
				collapsible
				collapsedSize={0}
				className="bg-card overflow-y-auto"
			>
				{right}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
