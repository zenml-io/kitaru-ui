import { useImperativeHandle, type Ref } from "react";
import { useGroupRef } from "react-resizable-panels";
import { LayoutLeft, LayoutRight } from "@untitledui/icons";
import { Button } from "./button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./resizable";

const PANEL_IDS = { left: "left", right: "right" } as const;

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

	useImperativeHandle(ref, () => ({
		expandRight() {
			const layout = groupRef.current?.getLayout();
			if (layout?.[PANEL_IDS.right] === 0) {
				groupRef.current?.setLayout({
					...layout,
					[PANEL_IDS.right]: DEFAULT_SIZES.right.default,
				});
			}
		},
	}));

	function toggleLeft() {
		const layout = groupRef.current?.getLayout();
		if (layout?.[PANEL_IDS.left] === 0) {
			groupRef.current?.setLayout({
				...layout,
				[PANEL_IDS.left]: DEFAULT_SIZES.left.default,
			});
		} else {
			groupRef.current?.setLayout({ ...layout, [PANEL_IDS.left]: 0 });
		}
	}

	function toggleRight() {
		const layout = groupRef.current?.getLayout();
		if (layout?.[PANEL_IDS.right] === 0) {
			groupRef.current?.setLayout({
				...layout,
				[PANEL_IDS.right]: DEFAULT_SIZES.right.default,
			});
		} else {
			groupRef.current?.setLayout({ ...layout, [PANEL_IDS.right]: 0 });
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
				defaultSize={DEFAULT_SIZES.left.default}
				minSize={DEFAULT_SIZES.left.min}
				collapsible
				collapsedSize={0}
				className="bg-card overflow-y-auto"
			>
				{left}
			</ResizablePanel>

			<ResizableHandle />

			<ResizablePanel
				defaultSize={DEFAULT_SIZES.center.default}
				minSize={DEFAULT_SIZES.center.min}
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

			<ResizableHandle />

			<ResizablePanel
				id={PANEL_IDS.right}
				defaultSize={DEFAULT_SIZES.right.default}
				minSize={DEFAULT_SIZES.right.min}
				collapsible
				collapsedSize={0}
				className="bg-card overflow-y-auto"
			>
				{right}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
