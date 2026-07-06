import type { ReactElement, ReactNode } from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@zenml/hashi/lib/utils";

// Leftmost navbar slot. Eats the surrounding navbar's `px-5` via `-ml-5`
// and adds a `border-r` divider before the back button. Hosts the brand
// mark (AppMark) in the live navbar and in the AppMark showcase mock so
// the two surfaces can't drift.
//
// Default render is a `<div>`; the live navbar passes
// `render={<Link to="/" aria-label="..." />}` to make the slot a link.
export function NavbarBrandSlot({
	children,
	className,
	render,
}: {
	children: ReactNode;
	className?: string;
	render?: ReactElement;
}) {
	return useRender({
		render: render ?? <div />,
		props: {
			className: cn(
				"border-border -ml-5 mr-1 flex h-12 shrink-0 items-center border-r",
				className
			),
			children,
		},
	});
}
