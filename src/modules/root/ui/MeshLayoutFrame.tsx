import KitaruLogo from "@/assets/icons/kitaru-logo.svg?react";
import type { ReactNode } from "react";
import { MeshGradientBg, type MeshGradientVariant } from "./MeshGradientBg";

type MeshLayoutFrameProps = {
	children: ReactNode;
	variant?: MeshGradientVariant;
};

export function MeshLayoutFrame({
	children,
	variant = "default",
}: MeshLayoutFrameProps) {
	return (
		<div className="relative flex flex-1 items-center justify-center">
			<MeshGradientBg variant={variant} />
			<div className="flex w-full flex-col items-center gap-6 px-4">
				<KitaruLogo className="h-5 w-auto" />
				{children}
			</div>
		</div>
	);
}
