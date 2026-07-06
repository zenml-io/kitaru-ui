import { Fragment, type ReactElement, type ReactNode } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@zenml/hashi/primitives/breadcrumb";

// Data-driven wrapper around the breadcrumb primitive. Pure UI — no router
// and no awareness of how the item list was produced. Consumers shape a
// `BreadcrumbItemData[]` from their router state and pass it in.

export type BreadcrumbItemData = {
	/** Stable identity for React reconciliation. */
	key: string;
	label: ReactNode;
	/**
	 * Router-specific link element wrapping the label (e.g. `<Link to=... />`
	 * from any router). Used when the item is neither current nor disabled.
	 * Omit to render the label as text even when it is not the current page.
	 * Ignored when `isCurrent` or `isDisabled` is true.
	 */
	labelRender?: ReactElement;
	isCurrent?: boolean;
	isDisabled?: boolean;
	/**
	 * Rendered inside the BreadcrumbItem after the label, before the next
	 * separator. Use for inline pills/switchers attached to a crumb (e.g. an
	 * inline version switcher on a flow-detail crumb).
	 */
	trailing?: ReactNode;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItemData[] }) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, i) => (
					<Fragment key={item.key}>
						<BreadcrumbItem>
							{item.isCurrent ? (
								<BreadcrumbPage className="font-semibold">
									{item.label}
								</BreadcrumbPage>
							) : item.isDisabled || !item.labelRender ? (
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink render={item.labelRender}>
									{item.label}
								</BreadcrumbLink>
							)}
							{item.trailing}
						</BreadcrumbItem>
						{i < items.length - 1 ? (
							<BreadcrumbSeparator>
								<span
									aria-hidden
									className="text-border text-base font-light select-none"
								>
									/
								</span>
							</BreadcrumbSeparator>
						) : null}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
