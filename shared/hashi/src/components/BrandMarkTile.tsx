import { KitaruMarkIcon } from "@zenml/hashi/components/KitaruMarkIcon";
import { ZenmlMarkIcon } from "@zenml/hashi/components/ZenmlMarkIcon";
import { cn } from "@zenml/hashi/lib/utils";

export type Brand = "zenml" | "kitaru";

const MARK_BY_BRAND = {
	zenml: ZenmlMarkIcon,
	kitaru: KitaruMarkIcon,
} as const;

// Brand-tile chrome used by AppMark (context-aware) and the AppMark
// showcase (brand-explicit). Single source of truth for the size, the
// brand-mark CSS variables, and the inner icon size — so the showcase
// mock can't visually drift from the live navbar.
export function BrandMarkTile({
	brand,
	className,
}: {
	brand: Brand;
	className?: string;
}) {
	const Icon = MARK_BY_BRAND[brand];
	return (
		<div
			data-app-mark={brand}
			className={cn(
				"flex size-12 shrink-0 items-center justify-center",
				"bg-(--brand-mark-bg) text-(--brand-mark-fg)",
				className
			)}
		>
			<Icon className="size-7" />
		</div>
	);
}
